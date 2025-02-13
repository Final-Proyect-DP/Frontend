import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Typography, Card, CardBody, Select, Option } from "@material-tailwind/react";
import { graphviz } from 'd3-graphviz'; // Importar Graphviz

const Mapgen = () => {
  const [theme, setTheme] = useState(""); // State for theme
  const [considerations, setConsiderations] = useState("be concise"); // State for considerations
  const [mapCode, setMapCode] = useState(""); // State for the Graphviz code
  const graphvizContainerRef = useRef(null); // Ref for the Graphviz container

  useEffect(() => {
    if (mapCode) {
      graphviz(graphvizContainerRef.current).renderDot(mapCode).on("end", () => {
        const svg = graphvizContainerRef.current.querySelector("svg");
        if (svg) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
        }
      });
    }
  }, [mapCode]);

  const handleSendMessage = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User ID or token is missing");
      return;
    }

    try {
      const encodedTheme = encodeURIComponent(theme);
      const encodedConsiderations = encodeURIComponent(considerations);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_MAPGENERATOR}?userId=${userId}&token=${token}&theme=${encodedTheme}&considerations=${encodedConsiderations}`, 
        {
          method: "GET",
          headers: {
            "accept": "application/json"
          }
        }
      );

      const data = await response.json().catch(() => null);
      if (response.ok && data) {
        let graphvizCode = data.botMessage.match(/```dot\n([\s\S]*?)\n```/);
        if (graphvizCode) {
          setMapCode(graphvizCode[1]);
        } else {
          console.error("Failed to parse graphviz code");
        }
        setTheme(""); 
        setConsiderations(""); 
      } else {
        console.error("Failed to send message:", data ? data.message : "No response data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExportImage = () => {
    const svg = graphvizContainerRef.current.querySelector("svg");
    if (svg) {
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "map.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleZoom = (zoomIn) => {
    const graphvizContainer = graphvizContainerRef.current;
    if (graphvizContainer) {
      const svg = graphvizContainer.querySelector("svg");
      if (svg) {
        const currentScale = svg.getAttribute("data-scale") ? parseFloat(svg.getAttribute("data-scale")) : 1;
        const newScale = zoomIn ? currentScale + 0.1 : currentScale - 0.1;
        svg.setAttribute("data-scale", newScale);
        svg.style.transform = `scale(${newScale})`;
        svg.style.transformOrigin = "center center";
      }
    }
  };

  return (
    <section className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
      <Typography variant="h2" className="font-bold mb-4 text-center sm:text-left">Map Generator</Typography>
      <Card className="flex-1 p-4 shadow-lg flex flex-col">
        <CardBody className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row mb-4">
            <Input
              type="text"
              placeholder="Map theme..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="flex-grow mb-4 sm:mb-0 sm:mr-4"
            />
            <Select
              value={considerations}
              onChange={(value) => setConsiderations(value)}
              className="flex-grow"
            >
              <Option value="be concise">Be Concise</Option>
              <Option value="be creative">Be Creative</Option>
              <Option value="be simple">Be Simple</Option>
              <Option value="structured visualizing">Structured Visualizing</Option>
              <Option value="be clear">Be Clear</Option>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row mb-4">
            <Button onClick={handleSendMessage} className="mb-4 sm:mb-0 sm:mr-4">Send</Button>
            <Button onClick={handleExportImage} className="mb-4 sm:mb-0 sm:mr-4">Export</Button>
          </div>
          <div id="graphviz-container" ref={graphvizContainerRef} className="flex-1 overflow-auto w-full h-full"></div>
        </CardBody>
      </Card>
    </section>
  );
};

export default Mapgen;
export { Mapgen };
