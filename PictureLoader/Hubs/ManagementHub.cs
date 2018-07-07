using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PictureLoader.Hubs
{
    public class ManagementHub : Hub
    {
        public async Task NotifyUpdate()
        {
            await Clients.All.SendAsync("receivedNotifyUpdate");
        }
    }
}
