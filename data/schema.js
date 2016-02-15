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
	globalIdField,
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
				id: globalIdField("Store"),
				linkConnection: {
					type: linkConnection.connectionType,
					args: connectionArgs, //first, last, .... which you can use below:
					resolve: (_, args) => connectionFromPromisedArray(
						db.collection("links").find({})
						.sort({createdAt: -1})
						.limit(args.first).toArray(),
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
			linkEdge: {
				type: linkConnection.edgeType,
				//this is the return value of the mutateAndGetPayload function or more particular,
				//the mongodb insertOne function
				resolve: (obj) => ({ node: obj.ops[0]}, cursor: obj.insertedId )
				//the ops array is an array of all docs inserted,
				//resolve with a node object because it is an edge
			},
			store: { //the link edges connections are rendered under a store in the relay app
				type: storeType, //so we need store information as well
				resolve: () => store
			}
		},

		mutateAndGetPayload: ({title, url}) => {
			return db.collection("links").insertOne({
				title,
				url,
				createdAt: Date.now()

			}); // this is also a promise
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