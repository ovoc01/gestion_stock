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

# --- Function to run shell commands ---
def run_command(command):
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"Successfully ran: {command}")
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")

if __name__ == "__main__":
    branch = input("Enter the branch name to deploy: ")
    commit_msg = input("Enter commit message: ")

    # --- Git Push ---
    run_command("git add .")
    run_command(f'git commit -m "{commit_msg}"')
    run_command(f"git push origin {branch}")

    # --- SSH & Deployment ---
    ssh_command = f"""
        ssh {vps_user}@{vps_ip} "
            cd {app_dir} &&
            git pull origin {branch} &&
            docker-compose pull &&
            docker-compose down &&
            docker-compose up -d --build
        "
    """
    run_command(ssh_command)

    print("Deployment complete!")