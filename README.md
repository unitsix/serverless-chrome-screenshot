# Serverless Chrome Screenshot

A [Serverless-framework](https://github.com/serverless/serverless) based function for AWS Lambda using the `serverless-plugin-chrome` plugin for Serverless to run Headless Chrome and return Screenshot PNG or PDF and optionally save to an S3 bucket.

Originally an example found here <https://github.com/adieuadieu/serverless-chrome>, this is expanded to include the use of docker and optionally save to an S3 bucket.

## Prerequisites

- Docker
- Docker Compose
- Make
- AWS Admin access

## Credentials

Either:

```bash
export AWS_PROFILE=<your-profile-name>
```

or

```bash
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

## Environment variables

Make sure you have set your environment variables properly or create a file `.env`. The file `.env.template` contains the environment variables that are used by the application. Keys found in LastPass.

## Make Usage

```bash
# using . env.template for .env as an example
$ make dotenv DOTENV=.env.template
# OR 
$ make .env
# Deploy the lambda stack
$ make deploy
# Remove the lambda stack
$ make remove
```

## Capture Screenshot of a given URL

When youhave deployed via serverless, it creates a Lambda function which will take a screenshot of a URL it's provided. You can provide this URL to the Lambda function via the AWS API Gateway.

An API endpoint will be provided in terminal. Use this URL to call the Lambda function with a url in the query string. E.g. `https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/?url=https://github.com/unitsix/serverless-chrome-screenshot`.

and for PDF E.g. `https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/pdf?url=https://github.com/unitsix/serverless-chrome-screenshot`.

Add `&mobile=1` for mobile device view.

Add `&bucket=<your-bucket-name>` to save to an S3 bucket.

Add `&publicread=1` to make image public.

Add `&filename=<your-file-name-without-ext>` to save as particular filename, if not defined it will default to md5 hash of url for subfolder and unix imestamp for filename.

## Further Configuration

Take a look at the `serverless-plugins-chrome` plugin's README for it's configuration options.

## Testing

Mocah and Chi used for testing with mocks on `make deploy`

Babel used to compile ES6 into .webpack

Istanbul used for code coverage

**Test JSON for Lambda**:

```
{
    "queryStringParameters": {
        "url" : "http://github.com/unitsix",
        "mobile" : false,
        "filename" : "",
        "bucket" : "test",
        "publicread" : false
    }
}
```

## Troubleshooting

See: <https://github.com/adieuadieu/serverless-chrome> for better troubleshooting on serverless-chrome