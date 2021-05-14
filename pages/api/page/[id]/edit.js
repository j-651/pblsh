var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  const {
    query: { id },
  } = req;

  const { contentTemporary, published } = req.body;

  if (!id || !contentTemporary || !published) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All three parameters must be provided",
      },
    });
  }

  try {
    const page = await guestClient.query(
      q.Update(q.Ref(q.Collection("Page"), id), {
        data: { contentTemporary, published, updatedAt: q.Now() },
      })
    );

    if (!page.ref) {
      return res.status(404).json({
        error: { name: "no_page_ref", message: `Page ref not returned` },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "page_updated",
          message: "Page successfully updated",
        },
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(error.requestResult.statusCode)
      .json({ error: "database_error", message: error.message });
  }
};
