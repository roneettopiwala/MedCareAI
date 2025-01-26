import React, { useState } from 'react';
import { Alert, Button, FormControl, InputLabel, Select, MenuItem, Grid, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';



import '@fontsource/roboto/300.css';
import { Paper, Box, Card, CardContent } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
    primary: {
      main: '#7F00FF', // Custom color for primary
    },
    secondary: {
      main: '#f48fb1', // Custom color for secondary
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
    }
  },
});

function App() {
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [gender, setGender] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user_id: "7NN2joCC0IeKxSxzNflzPOHiF2m2",  // Use dynamic input if needed
      saved_item_id: "rg2DZxKt7rkJ9grwDKnhHZ",  // Use dynamic input if needed
      pipeline_inputs: [
        { input_name: 'Age', value: age },
        { input_name: 'Symptoms', value: symptoms },
        { input_name: 'Gender', value: gender },
      ],
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/trigger-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1
      }}>
        <Paper 
          elevation={10} 
          sx={{ 
            maxWidth: "1920px",
            maxHeight: "1000px",
            padding: 3,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontSize : '66px',
              textAlign: 'center',
              marginBottom: 3,
              fontWeight: 'bold',
              fontFamily : 'Poppins, sans-serif',
              background : 'linear-gradient(45deg, #7F00FF 30%, #E100FF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}
          >
            MaxCare
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid 
              container 
              spacing={2} 
              direction="column"
              alignItems="center"
            >
              <Grid item>
                <TextField
                  size="small"
                  label="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  sx={{ width: '600px' }}
                />
              </Grid>
              <Grid item>
                <FormControl required size="small" sx={{ width: '600px' }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  size="small"
                  label="Symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                  multiline
                  rows={3}
                  sx={{ width: '600px' }}
                />
              </Grid>
              <Grid item>
              
              
                <Button 
                  variant="contained" 
                  type="submit"
                  size="medium"
                  sx={{ 
                    width: '600px',
                    py: 1,
                    fontSize: '1rem',
                    borderRadius: '30rem'
                  }}
                >
                  Analyze Symptoms
                </Button>
            
              </Grid>
            </Grid>
          </form>
          
          {response && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {response.output.output.split('\n').map((line, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '18px',
                            color: line.includes('Severity: High')
                              ? 'red'
                              : line.includes('Severity: Moderate')
                              ? 'yellow'
                              : line.includes('Severity: Low')
                              ? 'green'
                              : 'inherit',
                            boxShadow: line.includes('Severity: High')
                              ? '0 0 10px rgba(255, 0, 0, 0.76)'
                              : line.includes('Severity: Moderate')
                              ? '0 0 10px rgba(255, 217, 0, 0.5)'
                              : line.includes('Severity: Low')
                              ? '0 0 10px rgba(3, 223, 36, 0.63)'
                              : 'none',
                          }}
                        >
                          {line}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;