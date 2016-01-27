import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString
} from 'graphql';

let data = [42, 43, 44]

let counter = 42;
let schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: () => ({
			data: {
				type: new GraphQLList(GraphQLInt),
				resolve: () => data
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