# export-qualtrics-surveys
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/kori2000/telegram-bot/blob/main/LICENSE)
[![Unicorn](https://img.shields.io/badge/nyancat-approved-ff69b4.svg)](https://www.youtube.com/watch?v=QH2-TGUlwu4)

Retrieve all available surveys from organization with associated API token

## Installation

Please adjust the .env file before starting the Container.

```bash
# Replace .ent.test with .env to work in prod enviroment

# Settings
DATACENTER_ID=fra1
API_TOKEN=YOUR_TOKEN_ID
API_URL=https://fra1.qualtrics.com/API/v3
```

## Starting

```bash
# 🏗️ Build docker image
make build

# 🚀 Start docker container
make up

# 🛑 Stop docker container
make down
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)