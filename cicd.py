import os
from dotenv import load_dotenv
import subprocess

# Load environment variables from .env
load_dotenv()

# Get values from environment
repo_url = os.getenv("REPO_URL")
vps_user = os.getenv("VPS_USER")
vps_ip = os.getenv("VPS_IP")
app_dir = os.getenv("APP_DIR")

# --- Function to run SSH commands sequentially ---
def run_ssh_commands(commands):
    ssh_client = subprocess.Popen(
        ["ssh", f"{vps_user}@{vps_ip}"],
        stdin=subprocess.PIPE, 
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    for command in commands:
        print(f"Running command: {command}")
        ssh_client.stdin.write(command + "\n")

    ssh_client.stdin.close()
    output, error = ssh_client.communicate()

    if ssh_client.returncode == 0:
        print("All commands executed successfully.")
        print(f"Output: {output}")
    else:
        print(f"Error executing SSH commands (exit code {ssh_client.returncode}):")
        print(f"Error: {error}")

if __name__ == "__main__":
    branch = input("Enter the branch name to deploy: ")
    commit_msg = input("Enter commit message: ")

    # --- Git Push ---
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)
    subprocess.run(["git", "push", "origin", branch], check=True)

    # --- SSH & Deployment (sequential commands) ---
    commands = [
        f"cd {app_dir}",
        f"git pull origin {branch}",
        "docker-compose pull",
        "docker-compose down",  # Optional: Stop existing containers
        "docker-compose up -d --build"
    ]
    run_ssh_commands(commands)

    print("Deployment script complete!") 