// Compiles the flow DAG into a left-to-right GridRecipe matrix with merged cells.
//
// Each sink (a node with no outgoing wires, normally the final dish) becomes the
// root of a tree whose children are its inputs. Nodes feeding several steps are
// cloned per use, so every branch gets its own row band. Leaves become rows,
// a node's depth becomes its column, and a node spans the rows of its subtree.

const MAX_TREE_NODES = 4000; // guards against exponential blow-up on very shared graphs

export function compileGridMatrix(nodes, edges) {
  const nodesById = new Map(nodes.map((n) => [n.id, n]));
  const incoming = new Map();
  const outgoing = new Map();
  nodes.forEach((n) => {
    incoming.set(n.id, []);
    outgoing.set(n.id, []);
  });
  edges.forEach((e) => {
    if (nodesById.has(e.from) && nodesById.has(e.to) && e.from !== e.to) {
      incoming.get(e.to).push(e.from);
      outgoing.get(e.from).push(e.to);
    }
  });

  const byY = (a, b) => (nodesById.get(a)?.y || 0) - (nodesById.get(b)?.y || 0);
  incoming.forEach((list) => list.sort(byY));

  const hadSharedSplits = nodes.some((n) => outgoing.get(n.id).length > 1);

  const treeNodes = new Map();
  const treeChildren = new Map();
  const treeParent = new Map();
  let truncated = false;

  // `path` holds the ancestors of the current node, so an imported graph that
  // contains a cycle cannot recurse forever.
  function cloneSubtree(origId, parentTreeId, path) {
    const tId = `${origId}__${treeNodes.size}`;
    treeNodes.set(tId, { ...nodesById.get(origId), treeId: tId, origId });
    treeChildren.set(tId, []);
    treeParent.set(tId, parentTreeId);

    path.add(origId);
    for (const predId of incoming.get(origId)) {
      if (path.has(predId)) continue;
      if (treeNodes.size >= MAX_TREE_NODES) {
        truncated = true;
        break;
      }
      treeChildren.get(tId).push(cloneSubtree(predId, tId, path));
    }
    path.delete(origId);
    return tId;
  }

  let sinks = nodes.filter((n) => outgoing.get(n.id).length === 0);
  // A graph made only of cycles has no sink; fall back to output nodes.
  if (sinks.length === 0) sinks = nodes.filter((n) => n.type === 'output');
  sinks.sort((a, b) => a.y - b.y);
  const roots = sinks.map((s) => cloneSubtree(s.id, null, new Set()));

  const colOf = new Map();
  function computeDepth(tId) {
    const kids = treeChildren.get(tId);
    const d = kids.length === 0 ? 0 : Math.max(...kids.map(computeDepth)) + 1;
    colOf.set(tId, d);
    return d;
  }
  roots.forEach(computeDepth);

  const maxCol = Math.max(1, ...colOf.values());
  // Final dishes always line up in the last column.
  treeNodes.forEach((tNode, tId) => {
    if (tNode.type === 'output') colOf.set(tId, maxCol);
  });

  const rowRange = new Map();
  let rowCount = 0;
  function assignRows(tId) {
    const kids = treeChildren.get(tId);
    if (kids.length === 0) {
      const range = { start: rowCount, end: rowCount };
      rowCount += 1;
      rowRange.set(tId, range);
      return range;
    }
    let start = Infinity;
    let end = -Infinity;
    kids.forEach((k) => {
      const r = assignRows(k);
      start = Math.min(start, r.start);
      end = Math.max(end, r.end);
    });
    const range = { start, end };
    rowRange.set(tId, range);
    return range;
  }
  roots.forEach(assignRows);

  const numRows = rowCount;
  const numCols = maxCol + 1;
  const grid = Array.from({ length: numRows }, () => Array(numCols).fill(null));

  treeNodes.forEach((tNode, tId) => {
    const c = colOf.get(tId);
    const { start, end } = rowRange.get(tId);
    grid[start][c] = { kind: 'node', node: tNode, rowspan: end - start + 1, colspan: 1 };
    for (let r = start + 1; r <= end; r++) grid[r][c] = { kind: 'covered' };
  });

  // Dashed pass-through cells bridge a child to a parent more than one column away.
  treeNodes.forEach((tNode, tId) => {
    const pId = treeParent.get(tId);
    if (!pId) return;
    const cStart = colOf.get(tId) + 1;
    const cEnd = colOf.get(pId) - 1;
    if (cStart > cEnd) return;
    const { start, end } = rowRange.get(tId);
    grid[start][cStart] = {
      kind: 'passthrough',
      sourceOrigId: tNode.origId,
      rowspan: end - start + 1,
      colspan: cEnd - cStart + 1,
    };
    for (let r = start; r <= end; r++) {
      for (let c = cStart; c <= cEnd; c++) {
        if (r !== start || c !== cStart) grid[r][c] = { kind: 'covered' };
      }
    }
  });

  // Rows ready to render: covered cells dropped, empty slots filled.
  const rows = grid.map((row, r) =>
    row
      .map((cell, c) => ({ ...(cell || { kind: 'empty', rowspan: 1, colspan: 1 }), key: `${r}-${c}` }))
      .filter((cell) => cell.kind !== 'covered')
  );

  // Everything upstream and downstream of each node, for hover highlighting.
  const lineage = new Map();
  const walk = (startId, adj, into) => {
    const queue = [...adj.get(startId)];
    while (queue.length) {
      const id = queue.shift();
      if (into.has(id)) continue;
      into.add(id);
      queue.push(...adj.get(id));
    }
  };
  nodes.forEach((n) => {
    const related = new Set([n.id]);
    walk(n.id, incoming, related);
    walk(n.id, outgoing, related);
    lineage.set(n.id, related);
  });

  return { rows, numRows, numCols, hadSharedSplits, truncated, lineage };
}

// Longest-path layering for the "Auto-Layout" button. Ingredients always sit in column 0.
export function computeAutoLayout(nodes, edges) {
  const depth = new Map(nodes.map((n) => [n.id, 0]));
  for (let i = 0; i < nodes.length; i++) {
    let changed = false;
    edges.forEach((e) => {
      if (!depth.has(e.from) || !depth.has(e.to)) return;
      const next = depth.get(e.from) + 1;
      if (next > depth.get(e.to)) {
        depth.set(e.to, next);
        changed = true;
      }
    });
    if (!changed) break;
  }

  const columns = new Map();
  nodes.forEach((n) => {
    const col = n.type === 'ingredient' ? 0 : Math.max(1, depth.get(n.id));
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col).push(n);
  });

  const positions = new Map();
  [...columns.keys()]
    .sort((a, b) => a - b)
    .forEach((colKey, visualCol) => {
      columns
        .get(colKey)
        .sort((a, b) => a.y - b.y)
        .forEach((node, rowIdx) => {
          positions.set(node.id, { x: 48 + visualCol * 320, y: 88 + rowIdx * 140 });
        });
    });
  return positions;
}
