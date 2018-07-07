using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PictureLoader.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("receiveMessage", Context.ConnectionId, message);
        }
    }
}
