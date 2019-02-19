const nodes = require('nunjucks/src/nodes');

const NODE_KEYS = [
	'args',
	'arr',
	'body',
	'cond',
	'else_',
	'expr',
	'left',
	'name',
	'right',
	'target',
	'template',
	'val',
	'value'
];

const CHILD_KEYS = ['children', 'ops', 'targets'];

const NODE_NAMES = Object.keys(nodes);

const walk = (exports.walk = function walk(node, cb) {
	if (cb(node) !== false) {
		CHILD_KEYS.filter(key => Array.isArray(node[key])).forEach(key => {
			node[key].forEach(child => walk(child, cb));
		});

		NODE_KEYS.filter(key => node[key] && typeof node[key] == 'object').forEach(key =>
			walk(node[key], cb)
		);
	}

	return node;
});

const getNodeType = (exports.getNodeType = function getNodeType(node) {
	let type;

	return (
		node.type ||
		(NODE_NAMES.some(name => {
			if (node.constructor == nodes[name]) {
				type = name;
				return true;
			}
		}),
		type)
	);
});

exports.normalize = function normalize(node) {
	return walk(node, n => {
		n.type = getNodeType(n);
	});
};
