# Define the root directory
$rootDir = "MyFirstAPI"

# Define directories to create
$directories = @(
    "$rootDir/src/config",
    "$rootDir/src/controllers",
    "$rootDir/src/interfaces",
    "$rootDir/src/middlewares",
    "$rootDir/src/models",
    "$rootDir/src/routes",
    "$rootDir/src/services",
    "$rootDir/src/utils",
    "$rootDir/src/types",
    "$rootDir/src/openapi",
    "$rootDir/tests/unit",
    "$rootDir/tests/component",
    "$rootDir/tests/integration"
)

# Define files to create
$files = @(
    "$rootDir/src/config/index.ts",
    "$rootDir/src/config/database.ts",
    "$rootDir/src/config/security.ts",
    "$rootDir/src/config/openapi.ts",
    "$rootDir/src/config/opentelemetry.ts",
    "$rootDir/src/controllers/serviceController.ts",
    "$rootDir/src/interfaces/.gitkeep",  # Placeholder file
    "$rootDir/src/middlewares/errorHandler.ts",
    "$rootDir/src/middlewares/authentication.ts",
    "$rootDir/src/middlewares/validation.ts",
    "$rootDir/src/models/serviceModel.ts",
    "$rootDir/src/routes/serviceRoutes.ts",
    "$rootDir/src/services/serviceService.ts",
    "$rootDir/src/utils/logger.ts",
    "$rootDir/src/utils/responseFormatter.ts",
    "$rootDir/src/types/express.d.ts",
    "$rootDir/src/openapi/spec.yaml",
    "$rootDir/src/app.ts",
    "$rootDir/tests/unit/service.test.ts",
    "$rootDir/tests/component/component.test.ts",
    "$rootDir/tests/integration/serviceRoutes.test.ts",
    "$rootDir/.Dockerfile",
    "$rootDir/.docker-compose.yml",
    "$rootDir/package.json",
    "$rootDir/tsconfig.json",
    "$rootDir/.env",
    "$rootDir/.gitignore",
    "$rootDir/.dockerignore",
    "$rootDir/.npmrc",
    "$rootDir/Readme.md",
    "$rootDir/security-checks.sh"
)

# Create directories
foreach ($dir in $directories) {
    if (!(Test-Path -Path $dir)) {
        New-Item -Path $dir -ItemType Directory
        Write-Host "Created directory: $dir"
    }
}

# Create files
foreach ($file in $files) {
    if (!(Test-Path -Path $file)) {
        New-Item -Path $file -ItemType File
        Write-Host "Created file: $file"
    }
}

Write-Host "Folder structure and files created successfully."
