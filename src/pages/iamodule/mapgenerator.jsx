import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { graphviz } from 'd3-graphviz'; // Importar Graphviz

const Mapgen = () => {
  const [theme, setTheme] = useState(""); // State for theme
  const [considerations, setConsiderations] = useState(""); // State for considerations
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
      const response = await fetch(`${import.meta.env.VITE_API_MAPGENERATOR}?userId=${userId}&token=${token}&theme=${theme}&considerations=${considerations}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data) {
        let graphvizCode = data.botMessage.match(/```dot\n([\s\S]*?)\n```/);
        if (graphvizCode) {
          setMapCode(graphvizCode[1]);
        } else {
          console.error("Failed to parse graphviz code");
        }
        setTheme(""); // Clear the theme field
        setConsiderations(""); // Clear the considerations field
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
    <section className="flex-1 flex flex-col">
      <Typography variant="h2" className="font-bold mb-4">Map Generator</Typography>
      <Card className="flex-1 p-4 shadow-lg flex flex-col">
        <CardBody className="flex-1 flex flex-col">
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Map theme..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="flex-grow mr-4"
              style={{ marginRight: '1rem' }}
            />
            <Input
              type="text"
              placeholder="Map considerations..."
              value={considerations}
              onChange={(e) => setConsiderations(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="flex mb-4">
            <Button onClick={handleSendMessage} className="mr-4">Send</Button>
            <Button onClick={handleExportImage} className="mr-4">Export</Button>
            <Button onClick={() => handleZoom(true)} className="mr-2">Zoom In</Button>
            <Button onClick={() => handleZoom(false)}>Zoom Out</Button>
          </div>
          <div id="graphviz-container" ref={graphvizContainerRef} className="flex-1 overflow-auto w-full h-full"></div>
        </CardBody>
      </Card>
    </section>
  );
};

export default Mapgen;
export { Mapgen };
