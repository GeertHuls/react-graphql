import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString
} from 'graphql';

let Schema = (db) => {
	let linkType = new GraphQLObjectType({
		name: 'Link',
		fields: () => ({
			_id: { type: GraphQLString },
			title: { type: GraphQLString },
			url: { type: GraphQLString }
		})
	});

	let schema = new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'Query',
			fields: () => ({
				links: {
					type: new GraphQLList(linkType),
					 //toArray returns a promise which will be used by graphql
					resolve: () => db.collection("links").find({}).toArray()
				}
			})
		}),
	});

	return schema;
}

export default Schema;