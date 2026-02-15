import Bytez from "bytez.js"

const sdk = new Bytez(process.env.BYTEZ_API_KEY)
const model = sdk.model("inference-net/Schematron-3B")

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { name, role, tone } = req.body

    if (!name || !role || !tone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const prompt = `
Write a short thank-you note as I am leaving the company.

Colleague's name: ${name}
Colleague's role: ${role}

Tone style to start with: "${tone}"

My writing style:
- Slightly casual but still respectful
- Warm and genuine, not overly formal
- A little expressive and personal
- Not robotic or corporate-sounding
- Sounds like something I would actually say in person
- Simple words, natural flow
- Confident but humble

Instructions:
- Start naturally using the tone style provided.
- Match the energy of the tone.
- Make it personal to their specific role.
- Keep it under 100 words.
- Do NOT format it as an email.
- Do NOT include a subject line.
- Avoid generic phrases.
- Make it feel authentic and human.
`

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt
      }
    ])

    if (error) {
      return res.status(500).json({ error })
    }

    return res.status(200).json({
      message: output.content
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}
