import { Allow, Entity, Field, Fields } from "remult";
import { Category } from "./category";

@Entity("tasks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin",
})
export class Task {
  @Fields.autoIncrement()
  id = 0;
  @Fields.string<Task>({
    validate: (task) => {
      if (task.title.length < 3) throw Error("Too short");
    },
  })
  title = "";
  @Fields.boolean()
  completed = false;
  @Field(() => Category, { lazy: true, allowNull: true })
  category?: Category;
}
