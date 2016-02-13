import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString,
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

import {
	connectionDefinitions,
	connectionArgs,
	connectionFromPromisedArray,
	mutationWithClientMutationId
}from 'graphql-relay';

let Schema = (db) => {

	let store = {};
	let storeType = new GraphQLObjectType({
			name: 'Store',
			fields: () => ({
				linkConnection: {
					type: linkConnection.connectionType,
					args: connectionArgs, //first, last, .... which you can use below:
					resolve: (_, args) => connectionFromPromisedArray(
						db.collection("links").find({}).limit(args.first).toArray(),
												//eg: linkConnection (first: 2) 
												//then mongo client will limit to 2
						args
					)
				}
			})
		})

	let linkType = new GraphQLObjectType({
		name: 'Link',
		fields: () => ({
			id: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: (obj) => obj._id
			},
			title: { type: GraphQLString },
			url: { type: GraphQLString }
		})
	});
	
	let linkConnection = connectionDefinitions({
		name: 'Link',
		nodeType: linkType
	});

	//A relay mutation has a single input field and a unique mution id as opposed to a graphql mutation
	let createLinkMutation = mutationWithClientMutationId({
		name: 'CreateLink',

		inputFields: {
			title: { type: new GraphQLNonNull(GraphQLString) },
			url: { type: new GraphQLNonNull(GraphQLString) },
		},

		outputFields: {
			link: {
				type: linkType,
				//this is the return value of the mutateAndGetPayload function or more particular,
				//the mongodb insertOne function
				resolve: (obj) => obj.ops[0] //the array of all docs inserted
			}
		},

		mutateAndGetPayload: ({title, url}) => {
			return db.collection("links").insertOne({title, url}); // this is also a promise
		}
	});

	let schema = new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'Query',
			fields: () => ({
				store: {
					type: storeType,
					resolve: () => store
				}
			})
		}),
	
		mutation: new GraphQLObjectType({
			name: 'Mutation',
			fields: () => ({
				createLink: createLinkMutation
			})
		})
	});

	return schema;
}

export default Schema;