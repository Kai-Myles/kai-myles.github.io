export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Send POST only", { status: 405 });

    try {
      const payload = await request.json();

      // Get latest commit
      const latest = payload.commits?.[payload.commits.length - 1];
      if (!latest) return new Response("No commits", { status: 200 });

      // Make friendly strings
      const newName = `${payload.repository.name} Updates`;
      const newTopic = `Latest commit: ${latest.message.split("\n")[0]} — by ${latest.author.name}`;

      // Update Discord channel using PATCH
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "PATCH",
        headers: {
          "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}`, // must be a bot token
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newName,
          topic: newTopic
        })
      });

      return new Response("Channel updated!", { status: 200 });
    } catch (err) {
      return new Response(`Error: ${err}`, { status: 500 });
    }
  }
};
