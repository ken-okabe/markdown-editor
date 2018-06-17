(() => {
  const React = require("react");
  const {render} = require("react-dom");
  const {Button, Col, Row, Container} = require("reactstrap");

  const {T, now} = require("timeline-monoid");
  const marked = require("marked");

  const fs = require("fs");
  const util = require("util");

  const remote = require("electron").remote;
  const Dialog = remote.dialog;

  //=============================================

  const TimelineEl = (timelineEl) => {
    class TimelineComponent extends React.Component {
      constructor() {
        super();
        this.state = {
          el: timelineEl[now]
        };
        const dummyTL = timelineEl
          .wrap((val) => {
            this.setState({
              el: val
            });
          });
      }
      componentWillUnmount() {
        //timelineEl.done = 1;
      }
      render() {
        return (<span>{this.state.el}</span>);
      }
    }
    return (<TimelineComponent/>);
  };
  //=============================================

  const fileTL = T();

  const contentLoadTL = T(timeline => {
    fileTL.wrap((fileName) => {
      fs.readFile(fileName, "utf8", (err, data) => {
        timeline[now] = data;
      });
    });
  }).wrap((data) => (markdownTL[now] = data));


  const autoSave = T(
    (timeline) => {
      const f = () => {
        timeline[now] = true;
      };
      setInterval(f, 5000);
    }
  ).wrap(
    () => {
      (!!fileTL[now])
        ? (() => {
          fs.writeFile(fileTL[now], markdownTL[now]);
        })()
        : true;
    }

  );

  const Main = () => {
    const style0 = {
      "position": "fixed",
      "width": "100%",
      "height": "100%",
      "margin": "0px",
      "padding": "0px",
      "backgroundColor": "#000000",
      "color": "white"
    };
    const styleFile = {
      "position": "fixed",
      "padding": "3px",
      "color": "white",
      "fontSize": "22px"
    };

    return (<div style={style0}>
      <Container fluid={true}>
        <Row >
      <Col sm="2" >
        <Button onClick={() => {
        Dialog.showOpenDialog(null, {
          properties: ["openFile"],
          title: "File(Single Select)",
          defaultPath: ".",
          filters: [
            {
              name: "MarkDown",
              extensions: ["md"]
            }
          ]
        }, ([fileName]) => {
          const dummy = !!(fileName)
            ? (() => fileTL[now] = fileName)()
            : false;
        });

      }} >File</Button>

      </Col>
      <Col sm="10" >
        <div style = {styleFile}>
        {TimelineEl(fileTL)}
      </div>
      </Col>
      </Row>
      </Container>

      {Panes(style0)}
     </div>);
  };

  const Panes = (style0) => {
    const style1 = {
      "width": "100%",
      "height": "100%",
      "margin": "0px",
      "padding": "0px",
      "backgroundColor": "#000000"
    };
    return (
      //================
      <Container fluid={true} style={style0}>
        <Row style={style0}>
    <Col sm="6" >
      <div style={style1}>
        {Editor()}
      </div>
    </Col>
    <Col sm="6" >
     <div style={style1}>
        {Viewer()}
     </div>
    </Col>
  </Row>
</Container>
      //==================
      );
  };

  const markdownTL = T();

  const htmlTL = markdownTL
    .sync((text) => marked(text))
    .sync((html) => <div
      dangerouslySetInnerHTML={{
        __html: html
      }}/>);

  const Editor = () => TimelineEl(
    contentLoadTL
      .sync(content => {
        const contentHTML = content.replace(/\n/g, "<BR>");
        const onInput = (e) => {
          markdownTL[now] = e.target.innerText;
        };
        const style = {
          "width": "100%",
          "height": "100%",
          "padding": "15px",
          "overflow": "auto",
          "backgroundColor": "#1B2D33",
          "color": "white",
          "fontSize": "22px"
        };
        return (<div style={style}
          contentEditable
          onInput={onInput}

          dangerouslySetInnerHTML={{
            __html: contentHTML
          }}
          />);
      })
  );


  const Viewer = () => TimelineEl(
    htmlTL
      .sync(innerHTML => {
        const style = {
          "width": "100%",
          "height": "100%",
          "padding": "15px",
          "overflow": "auto",
          "backgroundColor": "#ffffff",
          "color": "#000000",
          "fontSize": "22px"
        };
        return <div style={style}>{innerHTML}</div>;
      })
  );
  //----------

  //======================================================
  render(Main(), document.getElementById("container"));

})();
