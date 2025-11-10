export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  price: string;
  details: string;
  availability: "Limited" | "Open" | "Sold out";
};

export const events: Event[] = [
  {
    id: "football-home-opener",
    title: "Football Home Opener",
    date: "September 7",
    time: "Kickoff 1:00 PM",
    price: "$35 / vehicle",
    availability: "Limited",
    details:
      "Arrive between 10:30 AM and noon. Seven-minute walk through the neighborhood. Tailgating welcome with chairs and small coolers.",
  },
  {
    id: "concert-under-lights",
    title: "Concert Under The Lights",
    date: "September 18",
    time: "Show 8:00 PM",
    price: "$30 / vehicle",
    availability: "Open",
    details:
      "Gates open at 6:00 PM. Follow the string lights down the driveway. Ride-share staging near exit for post-show pickup.",
  },
  {
    id: "rivalry-night",
    title: "Rivalry Night",
    date: "October 12",
    time: "Kickoff 7:15 PM",
    price: "$45 / vehicle",
    availability: "Limited",
    details:
      "Street marshals guide you into numbered spots. Coffee and water station near the garage. Quiet hours begin 30 minutes after final whistle.",
  },
  {
    id: "holiday-bowl",
    title: "Holiday Bowl",
    date: "December 28",
    time: "Kickoff 2:30 PM",
    price: "$50 / vehicle",
    availability: "Open",
    details:
      "Oversized vehicle spaces along side lot fence. Portable restrooms on site. Contact us for group arrivals larger than four vehicles.",
  },
];

