import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { workflowState } from "../../recoil/atoms";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function Home() {
  const [workflows, setWorkflows] = useRecoilState(workflowState);
  const [open, setOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // TODO: Add error handling and improve the logic to update the workflows state
  async function handleNewWorkflow(name: string) {
    const newWorkflow = {
      id: uuidv4(),
      name: name,
      flowData: { nodes: [], edges: [] },
    };
    const result = await axios.post(
      "http://localhost:3001/api/v1/workflows",
      newWorkflow,
    );
    if (result.status === 200) {
      console.log(result);
      setWorkflows([...workflows, newWorkflow]);
    } else {
      alert("Error creating new workflow");
    }
  }

  return (
    <Box sx={{ height: "90vh", width: "100vw" }}>
      <Box sx={{ display: "flex", justifyContent: "left" }}>
        <Typography sx={{ margin: "20px" }} variant="h4">
          AI Workflows
        </Typography>
        <Fragment>
          <Button
            onClick={handleClickOpen}
            sx={{ mt: "25px", height: "40px" }}
            variant="contained"
            color="primary"
          >
            <AddIcon sx={{ mr: "5px" }} />
            Add New
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: "form",
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(
                  (formData as any).entries(),
                );
                const email = formJson.email;
                console.log(email);
                handleClose();
              },
            }}
          >
            <DialogTitle>Workflow name</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add a new workflow, please enter the name of the workflow
              </DialogContentText>
              <TextField
                onChange={(e) => setNewWorkflowName(e.target.value)}
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  if (newWorkflowName !== "") {
                    handleNewWorkflow(newWorkflowName);
                    setNewWorkflowName("");
                    handleClose();
                  }
                }}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      </Box>
      <Grid2
        container
        sx={{ margin: "20px" }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {workflows.map((workflow) => (
          <Grid2 key={workflow.id}>
            <Link to={{ pathname: `/workflow/${workflow.id}` }}>
              <Paper
                elevation={5}
                sx={{
                  width: "300px",
                  height: "150px",
                  padding: "15px",
                  bgcolor: "#1a1919",
                  color: "white",
                  ":hover": { bgcolor: "darkgray", cursor: "pointer" },
                }}
              >
                <Typography variant="h6">{workflow.name}</Typography>
                <Typography variant="body1">
                  {JSON.stringify(
                    workflow.flowData.nodes.map((node) => node.type),
                  )}
                </Typography>
              </Paper>
            </Link>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
