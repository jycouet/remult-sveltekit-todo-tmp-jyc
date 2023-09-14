import { SqlDatabase, remult, type UserInfo } from "remult";
import { remultSveltekit } from "remult/remult-sveltekit";
import { Category } from "../shared/category";
import { Task } from "../shared/task";
import { TasksController } from "../shared/tasksController";
import type { ClassType } from "remult/classType";

SqlDatabase.LogToConsole = "oneLiner";

export const handleRemult = remultSveltekit({
  entities: [Task, Category],
  controllers: [TasksController],
  // dataProvider: createPostgresConnection({
  //   connectionString:
  //     "postgres://postgres:example@127.0.0.1:5433/sveltekit-todo-tmp-jyc",
  // }),
  getUser: async (event) =>
    (await event?.locals?.getSession())?.user as UserInfo,
  initApi: async () => {
    const catSuperTop = await upsertCategory("super top");
    const catSuperLow = await upsertCategory("super low");
    await upsertTitle("yop1", catSuperTop);
    await upsertTitle("yop2", catSuperTop);
    await upsertTitle("yop3", catSuperTop);
    await upsertTitle("yop4", undefined);
    await upsertTitle("coucou1", catSuperLow);
    await upsertTitle("coucou2", catSuperLow);

    const t = await remult.repo(Task).find({});
    // REMULT 1/ It's expected to have `category: undefined` because lazy true
    console.log(`toJson(t)`, remult.repo(Task).toJson(t));

    const cateList = t.map((item) => {
      let id = undefined;
      // REMULT 2/ I don't know how to manage the type
      if (r(Task).getEntityRef(item).fields.category) {
        id = remult.repo(Task).getEntityRef(item).fields.category.getId();
      }

      return {
        // ...u,
        // REMULT 3/ It feels like a lot to get the id
        category__ID: id,
      };
    });
    console.log(`Raw __ID`, cateList);

    // REMULT 4/ Tentative? Maybe userland?
    console.log(`theId`, idOf(Task, t[0]).category.getId());
  },
});

// I think that I start to like this!
// (I'm not sure about "r", but I don't really like "$", maybe "__"? rr (for "remult repo")?)
// Or user land? kql?
const r = <T>(entity: ClassType<T>) => {
  return remult.repo(entity);
};

// fr (field Ref?)
const idOf = <T>(entity: ClassType<T>, item: T) => {
  return remult.repo(entity).getEntityRef(item).fields;
};

const upsertTitle = async (title: string, category?: Category) => {
  const found = await remult.repo(Task).findFirst({ title });
  if (!found) {
    return await remult.repo(Task).insert({ title, category });
  }
  return found;
};

const upsertCategory = async (name: string) => {
  const found = await remult.repo(Category).findFirst({ name });
  if (!found) {
    return await remult.repo(Category).insert({ name });
  }
  return found;
};
