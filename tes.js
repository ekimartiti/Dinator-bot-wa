const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

(async() => {
    await characterAI.authenticateWithToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVqYmxXUlVCWERJX0dDOTJCa2N1YyJ9.eyJpc3MiOiJodHRwczovL2NoYXJhY3Rlci1haS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTU1OTEzNzU0OTk4NDI5MjE2OTQiLCJhdWQiOlsiaHR0cHM6Ly9hdXRoMC5jaGFyYWN0ZXIuYWkvIiwiaHR0cHM6Ly9jaGFyYWN0ZXItYWkudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY5MDI0NjQyMiwiZXhwIjoxNjkyODM4NDIyLCJhenAiOiJkeUQzZ0UyODFNcWdJU0c3RnVJWFloTDJXRWtucVp6diIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.FoP-xB9swljZmIeBdtrD7Y73_TZiujNm9UU_8lvsMv2mbG7nqKudhioi_Xiiy2LoLdL0uCh6AiIydfwtV6NzxCoEgS-YaQLVd4LCNpQevz9wKt8_V4Pf-e0Bi37IghGd5SEmXDloNj9Cd4-q07KHGLEBbw9K9gCMbXllV-h8bekyz725Mhv7PKtP7VNeOmV-69cGECWXWDmtH7HPPCveFi6zLExocWXfXkYcEsXA4PjsbNA08X1_nBTKt8i-XVESSFdic9nFE0v7bx3hH_XlAesAaN171SV2zrt7r-DfKsCBCVAQkPKi4RpXu5TIf-Urq_F8e3uxAHNbvAS2c5kHmg");

    const characterId = "8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw" // Discord moderator

    const chat = await characterAI.createOrContinueChat(characterId);
    const response = await chat.sendAndAwaitResponse('Hello discord mod!', true)

    console.log(response);
    // use response.text to use it in a string.
})();