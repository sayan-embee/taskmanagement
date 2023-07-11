using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public enum RepeatType
    {
        //
        // Summary:
        //     Daily
        Daily = 0,
        //
        // Summary:
        //     Weekly
        Weekly = 1,
        //
        // Summary:
        //     Absolute Monthly
        AbsoluteMonthly = 2,
        //
        // Summary:
        //     Relative Monthly
        RelativeMonthly = 3,
        //
        // Summary:
        //     Absolute Yearly
        AbsoluteYearly = 4,
        //
        // Summary:
        //     Relative Yearly
        RelativeYearly = 5,

         DoesNotRepeat=100
    }
}
