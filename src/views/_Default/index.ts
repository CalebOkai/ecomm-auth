import { RequestHandler } from "express";



/*************************************/
/** Default view for unassigned URLs */
export const Default: RequestHandler = async (req, res, next) => {
  const defaultResponse = (
    `<!DOCTYPE html>
    <html>
      <head>
        <title>
          E-Commerce
        </title>
      </head>
      <body>
        <h1>Ecommerce</h1>
        <h3>Welcome to the Ecommerce API!</h3>
        <br/>
        <p>Please check the Postman documentation for configured routes.</p>
      </body>
    </html>`
  );

  res.status(404).send(defaultResponse);
}