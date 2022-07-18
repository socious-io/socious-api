Attention: **DO NOT IMPORT** the files in this directory.

These files are meant for simplifying creation of new models for entities that already exist in the Laravel-era database. It should be possible to mostly copy files straight from here to your new Nest library, with some caveats:

- Our code standards call for the Model class (and respective file) to be singular. If for example you're copying Users.ts to the user library, you want to open the file, rename the class from `Users` to `User`, and copy the file to either `lib/users/src/user.model.ts` or `lib/users/src/models/user.model.ts`.

- For nullable fields, the generator creates `foo | null` TS typings, e.g. `name: string | null;`. The code is clearer if you change that to `name?: string;`. A simple regex replace should fix that: `(\w+): (.*) \| null;` → `$1?: $2;`.

- The generator doesn't reliably detect and produce foreign keys (or, as far as I've seen, not at all). That is actually fine due to our code isolation policy. That said, if your entity has a relation to another entity _within the same library_, it's ok to use TypeORM relation functionalities; but you'll have to write them yourself.

- Do read the entire file once and see if there's anything else you want to change.

- After copying, reformat the file (alt-shitf-F on vscode, or `npm run format; npm run lint`).

To re-generate them when the database is updated, run:

```shell
npx typeorm-model-generator -h localhost -p 33060 -d socious -u admin -x secret -e mysql -o reflected-models --noConfig --skipSchema --disablePluralization --strictMode "?"
```
