import { Allow, Entity, Fields } from "remult";

@Entity("categories", {
  allowApiCrud: Allow.authenticated,
})
export class Category {
  @Fields.autoIncrement()
  id = 0;
  @Fields.string()
  name = "";
}
