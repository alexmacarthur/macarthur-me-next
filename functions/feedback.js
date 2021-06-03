exports.handler = async function (event, context) {
    const { body } = event;

    console.log(body);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" })
    };
}
