const Tasks = require('../models/tasks');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
} = require('graphql');

// Tasks Type
const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString }
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      tasks: {
        type: new GraphQLList(TaskType),
        resolve(parent, args) {
          return Tasks.find();
        },
      },
      task: {
        type: TaskType,
        args: { 
            id:{
             type: GraphQLID 
            } 
        },
        resolve(parent, args) {
          return Tasks.findById(args.id);
        },
      },
    },
});


// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      // Add a Task
        addTask: {
            type: TaskType,
            args: {
                title: { 
                    type: GraphQLNonNull(GraphQLString) 
                },
                description: { 
                    type: GraphQLNonNull(GraphQLString) 
                },
                status: {
                    type: new GraphQLEnumType({
                    name: 'TaskStatus',
                    values: {
                        new: { value: 'Not Started' },
                        progress: { value: 'In Progress' },
                        completed: { value: 'Completed' },
                    },
                    }),
                    defaultValue: 'Not Started',
                },
            },
            resolve(parent, args) {
                const task = new Tasks({
                    title: args.title,
                    description: args.description,
                    status: args.status,
                });
        
                return task.save();
            },
        },
        // Delete a Task
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Tasks.findByIdAndRemove(args.id);
            },
        },
        // Update a Task
        updateTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'TasksStatusUpdate',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' },
                        },
                    }),
                },
            },
            resolve(parent, args) {
                return Tasks.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    { new: true }
                );
            },
        },
    },
});
  
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});