import {
  formatDate,
  validateTask,
  mergeTaskUpdate,
  createTask,
} from "./utils.js";

import { fetchSampleUsers } from "./api.js";

async function main() {
  console.log(formatDate(new Date("2026-07-22")));
  console.log(validateTask({ title: "Finish GT3", dueDate: "2026-07-22" }));
  console.log(mergeTaskUpdate({ title: "Old" }, { title: "New" }));

  try {
    const users = await fetchSampleUsers();
    console.log(users);

    const task = createTask({
      title: "Finish GT4",
      dueDate: "2026-07-22",
    });

    console.log(task);
  } catch (error) {
    console.error(error);
  }
}

main();