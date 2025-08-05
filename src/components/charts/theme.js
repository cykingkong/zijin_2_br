const textColorDark = 'white'
const gridColorDark = '#404040'
const axisLineColorDark = 'white'
const crossTextBackgroundColorDark = '#373a40'

const textColorLight = '#76808F'
const gridColorLight = '#35477c'
const axisLineColorLight = 'white'
const crossTextBackgroundColorLight = '#c3c3c3'

export default function(theme) {
    const textColor = theme === 'dark' ? textColorDark : textColorLight
    const gridColor = theme === 'dark' ? gridColorDark : gridColorLight
    const axisLineColor = theme === 'dark' ? axisLineColorDark : axisLineColorLight
    const crossLineColor = theme === 'dark' ? axisLineColorDark : axisLineColorLight
    const crossTextBackgroundColor = theme === 'dark' ? crossTextBackgroundColorDark : crossTextBackgroundColorLight
    return {
        grid: {
            horizontal: {
                color: gridColor
            },
            vertical: {
                color: gridColor
            }
        },
        candle: {
            bar: {
                upColor: '#00C851',
                downColor: '#ff4444',
                noChangeColor: '#888888'
            },
            priceMark: {
                high: {
                    color: textColor
                },
                low: {
                    color: textColor
                }
            },
            tooltip: {
                showRule: 'none',
                labels: ['Time', 'Open', 'Close', 'High', 'Low'],
                text: {
                    color: theme === 'dark' ? 'white' : 'black',
                },
                showType: 'standard',
                rect: {
                    offsetTop: 24,
                    borderColor: theme === 'dark' ? 'white' : '#ddd',
                    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)'
                }
            }
        },
        technicalIndicator: {
            tooltip: {
                showParams: false,
            }
        },
        xAxis: {
            enableAutoFit: true,
            axisLine: {
                color: axisLineColor
            },
            tickLine: {
                color: '#94A3B8'
            },
            tickText: {
                color: '#94A3B8'
            },
        },
        yAxis: {
            axisLine: {
                color: axisLineColor
            },
            tickLine: {
                color: 'white'
            },
            tickText: {
                color: '#94A3B8'
            }
        },
        separator: {
            color: axisLineColor
        },
        crosshair: {
            horizontal: {
                line: {
                    color: '#00C851',
                    size: 1
                },
                text: {
                    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                    color: theme === 'dark' ? 'white' : 'black',
                    borderColor: theme === 'dark' ? 'white' : '#ddd'
                }
            },
            vertical: {
                line: {
                    color: '#00C851',
                    size: 1
                },
                text: {
                    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                    color: theme === 'dark' ? 'white' : 'black',
                    borderColor: theme === 'dark' ? 'white' : '#ddd'
                }
            }
        }
    }
}