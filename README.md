# OpenLibry - The Simple and Free Software for School Libraries

OpenLibry is a simple, fast, and open management system for small libraries.

## Features

- Usable on computers, tablets, and phones
- On-the-fly search while typing for books, loans, and users. Simple filter for overdue books in a class directly on the borrowing screen
- Optimized for minimal mouse and keyboard clicks, especially for borrowing and returning books
- Easy installation in a local environment or in the cloud
- No complicated user permissions, unnecessary data fields, etc.
- Modern software stack with a next.js interface and a simple database

## Installation and Configuration

- Copy the example environment file: `cp .env_example .env`
- Configure the server name in a `.env` file in the main folder according to the values in `.env_example`, e.g., `NEXT_PUBLIC_API_URL="http://localhost:3000"`
- Set the value `AUTH_ENABLED` to `false` initially so that you can log in without authentication for the first time. Via `https://<domain>/auth/register`, you can create the first user and then set `AUTH_ENABLED` to `true`.

### Bare Metal Example with Raspberry Pi

For a local installation without Docker, follow these steps:

- Update the distribution: `sudo apt-get update` and `sudo apt-get upgrade`
- If `curl` is not installed: `apt install curl`
- Install the Node Version Manager (NVM): `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`. This should install `nvm`.
- Install the Node server: `nvm install --lts`
- If `git` is not installed: `sudo apt-get install git-all`
- Clone the repository from GitHub: `git clone https://github.com/jzakotnik/openlibry.git`
- Navigate to the appropriate directory: `cd openlibry`
- Copy the example file and adjust the API endpoint with the appropriate server name: `cp .env_example .env` and optionally `nano .env`
- Install all necessary Node packages: `npm install`
- Create an empty database (SQLite): `npx prisma db push`
- Start OpenLibry with `npm run dev`. Ensure the appropriate port is open and accessible via a browser.

### Docker

#### Testing or Permanent Installation with Docker (Tested with Linux Mint 21.3)

First, complete the following preparations:

Update the distribution: `sudo apt-get update` and `sudo apt-get upgrade`

If `curl` is not installed: `sudo apt install curl`

Install the Node Version Manager (NVM): `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

Install the Node server (restart the terminal beforehand): `nvm install --lts`

If `git` is not installed: `sudo apt-get install git-all`

Install Docker if not already installed:

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ${USER}
sudo systemctl is-active docker
```

Afterward, a re-login or restart is necessary for the user group changes (`usermod`) to take effect.

Next, you can install OpenLibry. Two modes are available: a sandbox mode for testing, where everything is removed after execution, or a permanent installation that restarts automatically with the computer, after crashes, etc. The following steps are required in either case (e.g., in the home directory):

- Clone the repository from GitHub: `git clone https://github.com/jzakotnik/openlibry.git`
- Navigate to the resulting directory: `cd openlibry`
- Then, configure/customize OpenLibry: First, place image files with your institution's logos in the "public" subfolder, following the example images provided. Next, create a `.env` file. (Note: Files with a leading dot are "hidden" by default in graphical interfaces. Use the "Ctrl-h" shortcut to make them visible.) Copy the existing `.env_example` file into the folder and rename it to `.env`:  
   `cp .env_example .env`
- Edit the resulting `.env` file with a text editor and adjust the values accordingly.
- Let Docker handle all necessary steps automatically: `docker build --no-cache -t openlibry .`

The next steps depend on your intent:

**a) Sandbox Mode for Testing Without Residue:**

- Start the Docker container: `docker run -i --rm -p 3000:3000 -t openlibry`
- Open OpenLibry in the browser and test it: `http://localhost:3000`
- Stop the process in the console with "Ctrl-c" to terminate it.
- Optionally, delete the Docker image: `docker image rm openlibry`

**b) Permanent Installation**

- Start the Docker container permanently; it will restart automatically after every reboot, crash, etc.: `docker compose up` (This starts Docker with parameters defined in the `docker-compose.yml` file. Among other things, volumes are set up here to store the user data of your installation. These remain intact after updating your Docker container.)
- Open OpenLibry in the browser: `http://localhost:3000`
- If needed, you can manually stop the container to prevent it from restarting automatically: `docker stop openlibry`
- If needed, you can delete everything related to OpenLibry in Docker: Remove the container and image with: `docker rm openlibry` and `docker image rm openlibry`

### Installation with nginx as Reverse Proxy and pm2 as Package Manager

An installation guide for configuring with the nginx web server on a subdomain can be found [here](./doc/WebServerInstall.md).

### Initializing with a First User

- Set the Auth variable in `.env` to `false` to log in without authentication
- Create a new user via `/auth/register`
- Set the Auth variable to `true`

## REST API

The REST API supports the resources `book` and `user`. For both, the corresponding HTTP operations (GET, PUT, POST, DELETE) are available. Borrowing is created by linking `user` and `book`, e.g., `http://localhost:3000/api/book/2001/user/1080` to borrow a book.

The API can be used to automate the import of users/books from other programs.

Further examples can be found in the [docs](./doc/sampleAPIRequests/) folder.

## Import and Export from Excel

To import existing data or export data from OpenLibry, there is an Excel function. This can also be used to create backups and re-import them if needed.

### Excel Export

To generate an Excel file, click the _Excel Export_ tile on the Reports page. This downloads an Excel file with two sheets: Books and Users.

The _User List_ worksheet contains the following columns:

- Created At
- Updated At
- ID
- Last Name
- First Name
- Phone
- Activated
- Email

The _Book List_ worksheet contains the following columns:

- ID
- Created At
- Updated At
- Status
- Borrowed At
- Return By
- Renewal Count
- Title
- Subtitle
- Author
- Library ID
- Barcode
- ISBN
- Edition
- Publisher Location
- Pages
- Summary
- Publisher
- Features
- Publication Date
- Dimensions
- Min Age
- Max Age

### Excel Import

To import an Excel file, click the _Excel Import_ tile on the Reports page. This leads to an import page.

There are two stages for importing data:

1. First, upload the Excel file. A preview shows how many users and books will be imported, and the respective first rows are displayed. The columns in the Excel file must match those generated during export.

2. If the preview looks as expected, click the _Import into Database_ button to import. A blank database must already exist, as described in the instructions.

## Contact

If you'd like to contribute, use the software, or need hosting, feel free to contact me at [info@openlibry.de](info@openlibry.de). If you'd like to support the software financially, you can do so easily via [Ko-Fi](https://ko-fi.com/jzakotnik).
