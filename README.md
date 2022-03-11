# pnc-api
The REST Apis of the Preben Norwegian Community software

## Project purpose

These are the REST Apis of the Preben Norwegian Community software. They offer a way to **handle the groups for each language course and to view and handle students enrollments in each group**. 

## How was it made

It was made with **Node.js** and **Express**. The software interfaces with a **MongoDB** database and with the **LearnWorlds APIs**. 

## How to use it

There is a **Docker image** that is automatically published with a **Github action**. For the usage, the only other important related thing is the **.env.example** file that shows the parameters that must be configured.

Another important thing is the initial admin user, to create on just look at the **scripts** folder.

## For development

To run it locally, just run `npm install` for installing the dependencies, `npm run serve` to run a local server. All the other scripts are written in the `package.json`. 

It is also important knowing the branches organization:
- __pre__: it is a branch used just for development and can be modified without caring too much. **Pushes must be done only on this branch**.
- __dev__: it is a branch that has a github action to create and push the `prebenorwegian/pnc-api-dev` docker image on dockerhub. **Merges must be done only from the pre branch**.
- __main__: it is a branch that has a github action to create and push the `prebenorwegian/pnc-api` docker image on dockerhub. **Merges must be done only from the dev branch**.

The **two docker images** (main and dev) exist because first ones wants to **test the changes on dev** and **only after pushing them in prod**.

## The SDK

This repo contains also the `sdk` folder, containing the **api client published on npm and used by the frontends** to interface to the APIs.
