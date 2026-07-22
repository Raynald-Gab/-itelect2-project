export async function fetchSampleUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();

    return users.map(({ id, name, email }) => ({
      id,
      name,
      email,
    }));
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    console.log("fetchSampleUsers finished.");
  }
}

export function fetchSampleUsersPromise() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    })
    .then((users) =>
      users.map(({ id, name, email }) => ({
        id,
        name,
        email,
      }))
    )
    .catch((error) => {
      console.error(error);
      return [];
    });
}