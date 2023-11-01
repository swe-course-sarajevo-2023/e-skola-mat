import React, { useRef, useState, useEffect } from "react";
import { CompactPicker } from "react-color";
import "bootstrap/dist/css/bootstrap.min.css";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const Canvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("handdrawn");
  const [tool1, setTool1] = useState("#000000");
  const [tool2, setTool2] = useState("empty");
  const [img, setImg] = useState();
  const [name, setName] = useState("");
  const [name1, setName1] = useState("");
  const [[x, y], coordinates] = useState([0, 0]);
  const canvasRef = useRef();
  const contextRef = useRef();

  function changeColor(color) {
    setTool1(color.hex);
  }

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.backgroundColor = "lightblue";
    const context = canvas.getContext("2d");
    context.lineWidth = 3;
    contextRef.current = context;
    const image = new Image();
    image.src = img;
    image.onload = () => {
      context.drawImage(image, 0, 0, 500, 500);
    };
  };

  const startDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = tool1;
    const { offsetX, offsetY } = nativeEvent;
    coordinates([offsetX, offsetY]);
    contextRef.current.beginPath();
    if (tool == "line") {
      contextRef.current.moveTo(offsetX, offsetY);
    }
    setIsDrawing(true);
  };

  const finishDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (tool == "line") {
      contextRef.current.moveTo(x, y);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
    if (tool == "rectangle") {
      contextRef.current.rect(x, y, offsetX - x, offsetY - y);
    }
    if (tool == "circle") {
      contextRef.current.arc(
        x,
        y,
        Math.sqrt(
          (offsetX - x) * (offsetX - x) + (offsetY - y) * (offsetY - y)
        ),
        0,
        2 * Math.PI
      );
    }
    if (tool2 == "full") {
      contextRef.current.fillStyle = tool1;
      contextRef.current.fill();
    } else contextRef.current.stroke();
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    console.log(offsetX, offsetY);
    if (tool == "handdrawn") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "lightblue";
    context.fillRect(0, 0, 500, 500);
  };

  function getImage(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    const image = new Image();
    image.src = "../../public/test-image.jpg";
    image.onload = () => {
      context.drawImage(image, 0, 0, 500, 500);
    };
  }

  function rotate(e) {
    e.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    var mCanvas = document.createElement("canvas");
    mCanvas.width = canvas.width;
    mCanvas.height = canvas.height;
    var mctx = mCanvas.getContext("2d");

    mctx.drawImage(canvas, 0, 0);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.translate(250, 250);

    var radians = (90 / 180) * Math.PI;
    context.rotate(radians);

    context.drawImage(mCanvas, -canvas.width / 2, -canvas.height / 2);

    context.rotate(-radians);
    context.translate(-canvas.width / 2, -canvas.height / 2);
  }
  useEffect(() => {
    prepareCanvas();
  }, [img]);
  useEffect(() => {
    setImg("./Images/test-image.jpg");
  }, []);

  const handleChange = (event) => {
    setTool(event.target.value);
  };
  const handleChangeStyle = (event) => {
    setTool2(event.target.value);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, marginTop: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            {" "}
            <div className="form-group col-4 col-md-4 col-sm-4 col-xs-4">
              <CompactPicker color={tool1} onChangeComplete={changeColor} />
            </div>
          </Grid>
          <Grid item xs={4} md={4} sx={{ textAlign: "center" }}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Selection:
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="handdrawn"
                name="radio-buttons-group"
                onChange={handleChange}
              >
                <FormControlLabel
                  value="handdrawn"
                  control={<Radio />}
                  label="Hand drawn"
                />
                <FormControlLabel
                  value="line"
                  control={<Radio />}
                  label="Line"
                />
                <FormControlLabel
                  value="rectangle"
                  control={<Radio />}
                  label="Rectangle"
                />
                <FormControlLabel
                  value="circle"
                  control={<Radio />}
                  label="Circle"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4} md={4} sx={{ textAlign: "center" }}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Style:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="empty"
                name="radio-buttons-group"
                onChange={handleChangeStyle}
              >
                <FormControlLabel
                  value="empty"
                  control={<Radio />}
                  label="Empty"
                />
                <FormControlLabel
                  value="full"
                  control={<Radio />}
                  label="Full"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <div className="form-group col-4">
        <form className="form-inline">
          <button
            className="form-control"
            onClick={rotate}
            style={{ width: "30%" }}
          >
            Rotate
          </button>
        </form>
      </div>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <button
        className="form-control"
        onClick={clearCanvas}
        style={{ width: "10%" }}
      >
        Clear
      </button>
    </div>
  );
};

export default Canvas;
