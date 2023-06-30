import { model, Schema } from "mongoose";

interface IComment {
    name: String,
    endDate: String 
}

const commentSchema = new Schema<IComment>({
    name: String,
    endDate: String
})
 export default model<IComment>("Comment", commentSchema)