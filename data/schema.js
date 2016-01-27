import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString
} from 'graphql';

let data = [
	{ counter: 42 },
	{ counter: 43 },
	{ counter: 44 }
];

let linkType = new GraphQLObjectType({
	name: 'Link',
	fields: () => ({
		_id: { type: GraphQLString },
		title: { type: GraphQLString },
		url: { type: GraphQLString }
	})
});

let counter = 42;
let schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: () => ({
			links: {
				type: new GraphQLList(linkType),
				resolve: () => data //TODO: read from Mongodb
			}
		})
	}),

	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: () => ({
			incrementCounter: {
				type: GraphQLInt,
				resolve: () => ++counter
			}
		})
	})
});

export default schema;