// Imports the Google Cloud Tasks library.
const { CloudTasksClient } = require("@google-cloud/tasks");

// Instantiates a client.
const client = new CloudTasksClient();

exports.taskGenerator = async (req, res) => {
  const taskCount = +process.env.TASK_COUNT || 10;

  for (let i = 0; i < taskCount; i++) {
    const task = {
      httpRequest: {
        httpMethod: "POST",
        url: process.env.TASK_ENDPOINT,
      },
    };

    const payload = {
      a: Math.floor(Math.random() * 100),
      b: Math.floor(Math.random() * 100),
    };

    if (payload) {
      task.httpRequest.body = Buffer.from(JSON.stringify(payload)).toString(
        "base64"
      );
      task.httpRequest.headers = {
        "Content-Type": "application/json",
      };
    }

    // Send create task request.
    console.log("Sending task:");
    console.log(task);

    const request = {
      parent: process.env.TASK_QUEUE_PATH,
      task,
    };

    const [response] = await client.createTask(request);
    console.log(`Created task ${response.name}`);
  }

  res.json({ status: "OK" });
};

exports.taskHandler = async (req, res) => {
  console.log("body", JSON.stringify(req.body));
  const a = req.body.a;
  const b = req.body.b;

  const result = a + b;

  // Artificial delay to reflect task uncertainty
  await new Promise((resolve) => {
    setTimeout(resolve, 500 + Math.floor(Math.random() * 1000));
  });

  console.log("a", a, "b", b, "result", result);

  res.json({ result });
};
