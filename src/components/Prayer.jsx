
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import CardActionArea from "@mui/material/CardActionArea";

export default function Prayer({title,time}) {
  return (

      <Card sx={{  mt:3, width:"300px", textAlign:"center"}}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200px"
            image="\temple.jpg"
          />
          <CardContent>
            <Typography variant="h5" component="div">
             {title}
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
            {time}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
  );
}
