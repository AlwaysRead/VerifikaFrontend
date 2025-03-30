import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  keyframes,
  Link,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
  Fade,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchIcon from '@mui/icons-material/Search';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Define animations
const scanAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CF9FFF',
      light: '#FDE9FF',
      dark: '#8E75A6',
    },
    secondary: {
      main: '#005B48',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(14, 14, 14, 0.9)',
    },
    text: {
      primary: '#FDE9FF',
      secondary: 'rgba(253, 233, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
      letterSpacing: '-0.015em',
    },
    body1: {
      letterSpacing: '-0.015em',
      lineHeight: 1.6,
    },
    body2: {
      letterSpacing: '-0.01em',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(207, 159, 255, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #CF9FFF 0%, #8E75A6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8E75A6 0%, #CF9FFF 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(14, 14, 14, 0.9)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(207, 159, 255, 0.1)',
          '&:hover': {
            borderColor: 'rgba(207, 159, 255, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(14, 14, 14, 0.6)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#CF9FFF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#CF9FFF',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [analysisOptions, setAnalysisOptions] = useState({
    sentiment: true,
    political_bias: true,
    clickbait: true
  });
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const openHistory = Boolean(historyAnchorEl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch('https://verifika.onrender.com/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          analysis_options: analysisOptions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResult(data);
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        text: text.substring(0, 100) + '...', // Truncate text for display
        result: data,
        timestamp: new Date().toLocaleString()
      }, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setText(text);
    setCharCount(text.length);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleCopyResult = () => {
    const resultText = `Analysis Result:\n${result.data.prediction}\nConfidence: ${result.data.confidence.toFixed(2)}%`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
    setCharCount(0);
    setWordCount(0);
  };

  const handleDeleteHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleAnalysisOptionChange = (option) => {
    setAnalysisOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
  };

  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setHistoryAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Box
          sx={{
            bgcolor: 'rgba(14, 14, 14, 0.9)',
            borderBottom: '1px solid',
            borderColor: 'rgba(207, 159, 255, 0.1)',
            mb: 6,
            py: 4,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '800px' }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(207, 159, 255, 0.1)',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#CF9FFF',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    AI-Powered News Analysis
                  </Typography>
                </Box>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #CF9FFF 0%, #FDE9FF 50%, #8E75A6 100%)',
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 15px rgba(207, 159, 255, 0.3)',
                  }}
                >
                  Verifika
                </Typography>
                <Typography 
                  variant="h4" 
                  color="text.secondary" 
                  sx={{ 
                    maxWidth: 600,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                    fontWeight: 400,
                    mb: 4,
                    color: 'rgba(253, 233, 255, 0.8)',
                  }}
                >
                  Harness the power of AI to analyze sentiment, detect political bias, and identify clickbait patterns — ensuring news authenticity in real-time.
                </Typography>
              </Box>

              {/* History Button */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="View History" arrow>
                  <IconButton
                    onClick={handleHistoryClick}
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'rgba(207, 159, 255, 0.1)',
                      borderRadius: 2,
                      p: 1,
                      '&:hover': {
                        bgcolor: 'rgba(207, 159, 255, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={historyAnchorEl}
                  open={openHistory}
                  onClose={handleHistoryClose}
                  TransitionComponent={Fade}
                  sx={{
                    '& .MuiPaper-root': {
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'rgba(207, 159, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      backdropFilter: 'blur(10px)',
                      maxHeight: '70vh',
                      maxWidth: '400px',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'rgba(207, 159, 255, 0.1)',
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Analysis History
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearHistory}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'rgba(255, 99, 132, 0.1)',
                        },
                      }}
                    >
                      Clear All
                    </Button>
                  </Box>
                  {history.length > 0 ? (
                    history.map((item) => (
                      <MenuItem 
                        key={item.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 1,
                          p: 2,
                          borderBottom: '1px solid',
                          borderColor: 'rgba(207, 159, 255, 0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(207, 159, 255, 0.1)',
                          },
                          position: 'relative',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp}
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {item.text}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.result.data.prediction === 'Fake News' ? (
                              <WarningIcon sx={{ color: 'error.main', fontSize: 16 }} />
                            ) : (
                              <VerifiedIcon sx={{ color: 'success.main', fontSize: 16 }} />
                            )}
                            <Typography
                              variant="body2"
                              color={item.result.data.prediction === 'Fake News' ? 'error' : 'success.main'}
                              sx={{ fontWeight: 500 }}
                            >
                              {item.result.data.prediction} ({item.result.data.confidence.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHistory(item.id);
                            }}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main',
                                bgcolor: 'rgba(255, 99, 132, 0.1)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No analysis history yet
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ flex: 1 }}>
          {/* Features Section - Horizontal Layout */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 6, 
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '900px',
            mx: 'auto',
          }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'rgba(14, 14, 14, 0.6)',
                border: '1px solid',
                borderColor: 'rgba(207, 159, 255, 0.1)',
                borderRadius: 2,
                width: '250px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'rgba(207, 159, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(207, 159, 255, 0.15)',
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(207, 159, 255, 0.1)',
                }}
              >
                <SecurityIcon sx={{ color: '#CF9FFF', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.light' }}>
                  AI-Powered Analysis
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Advanced machine learning algorithms
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'rgba(14, 14, 14, 0.6)',
                border: '1px solid',
                borderColor: 'rgba(207, 159, 255, 0.1)',
                borderRadius: 2,
                width: '250px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'rgba(207, 159, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(207, 159, 255, 0.15)',
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(207, 159, 255, 0.1)',
                }}
              >
                <SpeedIcon sx={{ color: '#CF9FFF', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.light' }}>
                  Real-time Results
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Instant analysis and feedback
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'rgba(14, 14, 14, 0.6)',
                border: '1px solid',
                borderColor: 'rgba(207, 159, 255, 0.1)',
                borderRadius: 2,
                width: '250px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'rgba(207, 159, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(207, 159, 255, 0.15)',
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(207, 159, 255, 0.1)',
                }}
              >
                <InfoIcon sx={{ color: '#CF9FFF', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.light' }}>
                  Detailed Insights
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Comprehensive analysis metrics
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Main Input Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              bgcolor: 'rgba(14, 14, 14, 0.8)',
              border: '1px solid',
              borderColor: 'rgba(207, 159, 255, 0.1)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                borderColor: 'rgba(207, 159, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(207, 159, 255, 0.1)',
              },
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(14, 14, 14, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  animation: `${fadeIn} 0.3s ease-out`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress 
                    size={60} 
                    sx={{ 
                      color: '#CF9FFF',
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }} 
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(transparent, rgba(207, 159, 255, 0.1), transparent)',
                      animation: `${scanAnimation} 2s linear infinite`,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 4,
                      color: '#CF9FFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontWeight: 600,
                      textShadow: '0 2px 10px rgba(207, 159, 255, 0.3)',
                    }}
                  >
                    <DocumentScannerIcon sx={{ animation: `${fadeIn} 1s ease-in-out infinite alternate` }} />
                    Analyzing text...
                  </Typography>
                </Box>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Paste your news article here..."
                  value={text}
                  onChange={handleTextChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 1, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TextFieldsIcon fontSize="small" />
                    <Typography variant="body2">{wordCount} words</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FormatSizeIcon fontSize="small" />
                    <Typography variant="body2">{charCount} characters</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-start' }}>
                <Button
                  onClick={() => handleAnalysisOptionChange('sentiment')}
                  variant={analysisOptions.sentiment ? "contained" : "outlined"}
                  startIcon={<SentimentSatisfiedAltIcon sx={{ fontSize: 20 }} />}
                  size="small"
                  sx={{
                    borderRadius: 20,
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: analysisOptions.sentiment ? 'primary.main' : 'transparent',
                    borderColor: analysisOptions.sentiment ? 'primary.main' : 'rgba(207, 159, 255, 0.2)',
                    color: analysisOptions.sentiment ? 'background.default' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: analysisOptions.sentiment ? 'primary.dark' : 'rgba(207, 159, 255, 0.1)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(207, 159, 255, 0.2)',
                    },
                  }}
                >
                  Sentiment
                </Button>

                <Button
                  onClick={() => handleAnalysisOptionChange('political_bias')}
                  variant={analysisOptions.political_bias ? "contained" : "outlined"}
                  startIcon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
                  size="small"
                  sx={{
                    borderRadius: 20,
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: analysisOptions.political_bias ? 'primary.main' : 'transparent',
                    borderColor: analysisOptions.political_bias ? 'primary.main' : 'rgba(207, 159, 255, 0.2)',
                    color: analysisOptions.political_bias ? 'background.default' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: analysisOptions.political_bias ? 'primary.dark' : 'rgba(207, 159, 255, 0.1)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(207, 159, 255, 0.2)',
                    },
                  }}
                >
                  Political Bias
                </Button>

                <Button
                  onClick={() => handleAnalysisOptionChange('clickbait')}
                  variant={analysisOptions.clickbait ? "contained" : "outlined"}
                  startIcon={<WarningAmberIcon sx={{ fontSize: 20 }} />}
                  size="small"
                  sx={{
                    borderRadius: 20,
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: analysisOptions.clickbait ? 'primary.main' : 'transparent',
                    borderColor: analysisOptions.clickbait ? 'primary.main' : 'rgba(207, 159, 255, 0.2)',
                    color: analysisOptions.clickbait ? 'background.default' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: analysisOptions.clickbait ? 'primary.dark' : 'rgba(207, 159, 255, 0.1)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(207, 159, 255, 0.2)',
                    },
                  }}
                >
                  Clickbait
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClear}
                  startIcon={<ClearIcon sx={{ fontSize: 20 }} />}
                  disabled={!text.trim()}
                  sx={{
                    borderRadius: 20,
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    ml: 'auto',
                    borderColor: 'rgba(207, 159, 255, 0.2)',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 99, 132, 0.1)',
                      borderColor: 'error.main',
                      color: 'error.main',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Clear
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  disabled={loading || !text.trim()}
                  sx={{
                    minWidth: 250,
                    height: 50,
                    px: 4,
                    py: 1,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 25,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #CF9FFF 0%, #8E75A6 100%)',
                    boxShadow: '0 4px 20px rgba(207, 159, 255, 0.3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8E75A6 0%, #CF9FFF 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(207, 159, 255, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(207, 159, 255, 0.5)',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Text'}
                </Button>
              </Box>
            </form>

            {result && (
              <Paper
                elevation={0}
                sx={{
                  mt: 4,
                  p: 3,
                  mb: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {result.data.prediction === 'Fake News' ? (
                      <WarningIcon sx={{ color: 'error.main', fontSize: 24 }} />
                    ) : (
                      <VerifiedIcon sx={{ color: 'success.main', fontSize: 24 }} />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Analysis Result
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyResult}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                      },
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy Result'}
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    color={result.data.prediction === 'Fake News' ? 'error' : 'success.main'}
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    {result.data.prediction}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {result.data.confidence.toFixed(1)}%
                  </Typography>
                </Box>

                {/* Additional Analysis Section */}
                {result.data.additional_analysis && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'rgba(99, 102, 241, 0.1)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Additional Analysis
                    </Typography>

                    {/* Sentiment Analysis */}
                    {result.data.additional_analysis.sentiment && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {result.data.additional_analysis.sentiment.sentiment === 'positive' ? (
                            <SentimentSatisfiedAltIcon sx={{ color: 'success.main' }} />
                          ) : result.data.additional_analysis.sentiment.sentiment === 'negative' ? (
                            <SentimentVeryDissatisfiedIcon sx={{ color: 'error.main' }} />
                          ) : (
                            <SentimentNeutralIcon sx={{ color: 'warning.main' }} />
                          )}
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            Sentiment Analysis
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Overall: {result.data.additional_analysis.sentiment.sentiment}
                          {' • '}
                          Score: {(result.data.additional_analysis.sentiment.compound_score * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    )}

                    {/* Political Bias */}
                    {result.data.additional_analysis.political_bias && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {result.data.additional_analysis.political_bias.bias === 'left-leaning' ? (
                            <TrendingUpIcon sx={{ color: 'primary.main' }} />
                          ) : result.data.additional_analysis.political_bias.bias === 'right-leaning' ? (
                            <TrendingDownIcon sx={{ color: 'secondary.main' }} />
                          ) : (
                            <TrendingFlatIcon sx={{ color: 'text.secondary' }} />
                          )}
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            Political Bias
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {result.data.additional_analysis.political_bias.bias}
                          {' • '}
                          Score: {(result.data.additional_analysis.political_bias.bias_score * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    )}

                    {/* Clickbait Detection */}
                    {result.data.additional_analysis.clickbait && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <WarningAmberIcon sx={{ color: result.data.additional_analysis.clickbait.is_clickbait ? 'warning.main' : 'success.main' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            Clickbait Detection
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {result.data.additional_analysis.clickbait.is_clickbait ? 'Clickbait Detected' : 'No Clickbait Detected'}
                          {' • '}
                          Score: {(result.data.additional_analysis.clickbait.clickbait_score * 100).toFixed(1)}%
                        </Typography>
                        {result.data.additional_analysis.clickbait.clickbait_matches.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Detected patterns: {result.data.additional_analysis.clickbait.clickbait_matches.join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            )}
          </Paper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                animation: `${fadeIn} 0.3s ease-out`,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 20px rgba(220, 38, 38, 0.1)',
                },
              }}
            >
              {error}
            </Alert>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'rgba(99, 102, 241, 0.1)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                © 2024 Verifika. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link
                  href="https://github.com/Nichkol/Fake-News-Detection"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    color: 'text.secondary', 
                    textDecoration: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: '#6366f1',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <GitHubIcon />
                  <Typography variant="body2">View on GitHub</Typography>
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;