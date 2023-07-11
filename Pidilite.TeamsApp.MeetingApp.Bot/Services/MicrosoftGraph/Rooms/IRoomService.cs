// <copyright file="UsersService.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

using Microsoft.Graph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph
{
    public interface IRoomService
    {
        Task<IEnumerable<Place>> GetAllRoomsAsync(string filter = null);
        Task<Place> GetRoomAsync(string roomId);
        Task<IList<ScheduleInformation>> GetRoomSchedule(RoomScheduleModel roomSchedule);
    }
}