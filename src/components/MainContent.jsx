import { Box, Divider, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Prayer from "./prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";

export default function MainContent() {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "long" });
  const year = today.getFullYear();
  const displayDatee = `${day} ${month} | ${year}`;
  const apiDate = `${day}-${today.getMonth() + 1}-${year}`;

  const [city, setCity] = useState(localStorage.getItem("city") || "");
  const [loading, setLoading] = useState(true);
  const [timings, setTimings] = useState({});
  const [remainingTime, setRemainingTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");

  const cites = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Qalyubia",
    "Sharqia",
    "Dakahlia",
    "Beheira",
    "Kafr El Sheikh",
    "Gharbia",
    "Monufia",
    "Fayoum",
    "Beni Suef",
    "Minya",
    "Assiut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "North Sinai",
    "South Sinai",
    "Port Said",
    "Suez",
    "Ismailia",
  ];

  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  useEffect(() => {
    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity/${apiDate}?country=EGY&city=${city}`
      )
      .then((res) => {
        setTimings(res.data.data.timings);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiDate, city]);

  function setupCountDown() {
    const momentNow = moment();

    let prayerIndex;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      setNextPrayer(prayers[1]);
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      setNextPrayer(prayers[2]);
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      setNextPrayer(prayers[3]);
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      setNextPrayer(prayers[4]);
      prayerIndex = 4;
    } else {
      setNextPrayer(prayers[0]);
      prayerIndex = 0;
    }

    const nextPrayer = prayers[prayerIndex];
    const nextPrayerTime = timings[nextPrayer];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    let reaminingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (reaminingTime < 0) {
      let midNightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      let fajrToMidNightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      let totalDiff = midNightDiff + fajrToMidNightDiff;

      reaminingTime = totalDiff;
    }

    let reaminingTimeDuration = moment.duration(reaminingTime);

    setRemainingTime(
      `${reaminingTimeDuration.hours()} H: ${reaminingTimeDuration.minutes()} M : ${reaminingTimeDuration.seconds()} S`
    );
  }

  useEffect(() => {
    localStorage.setItem("city", city);
  }, [city]);

  useEffect(() => {
    const interval = setInterval(() => {
      setupCountDown();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timings, nextPrayer]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{
          flexWrap: "wrap",
          textAlign: { xs: "center", sm: "left" },
          mt: 2,
        }}
      >
        <Stack direction="column" spacing={2} textAlign="center">
          <Typography variant="h5" color="#fff">
            {displayDatee}
          </Typography>
          <Typography variant="h6" color="#fff">
            {city || "Cairo"}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={2}>
          <Typography variant="h5" color="#fff">
            Remaining until {nextPrayer} prayer
          </Typography>
          <Typography variant="h5" color="#fff" textAlign="center">
            {remainingTime}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: "#fff", opacity: 0.5, mt: 3 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"center"}
        gap={2}
        sx={{ mt: 3, width: "100%" }}
      >
        <FormControl
          sx={{
            flex: 1,
            background: "#fff",
            maxWidth: { xs: "100%", sm: "300px" },
          }}
        >
          <InputLabel sx={{ color: "#000" }}>City</InputLabel>
          <Select value={city} onChange={handleCityChange} label="City">
            {cites.map((cityy, index) => (
              <MenuItem key={index} value={cityy}>
                {cityy}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        gap={2}
        sx={{ mt: 4, flexWrap: "wrap" }}
      >
        <Prayer title="fajr" time={loading ? "loading..." : timings.Fajr} />
        <Prayer title="dhuhr" time={loading ? "loading..." : timings.Dhuhr} />
        <Prayer title="asr" time={loading ? "loading..." : timings.Asr} />
        <Prayer
          title="maghrib"
          time={loading ? "loading..." : timings.Maghrib}
        />
        <Prayer title="isha" time={loading ? "loading..." : timings.Isha} />
      </Stack>
    </Box>
  );
}
