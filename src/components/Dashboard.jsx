import { useState, useEffect } from "react"
import { database } from "./firebase-config"
import { ref, onValue } from "firebase/database"
import { WiHumidity, WiThermometer, WiRaindrop, WiRain } from "react-icons/wi"
import { GiWateringCan, GiElectric } from "react-icons/gi"
import { MdOutlineWaterDrop } from "react-icons/md"

function Dashboard() {
  const [sensorData, setSensorData] = useState({
    humidity: 0,
    temperature: 0,
    moisture: 0,
    rain: false,
    motor: "OFF",
    timestamp: null,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    // Reference to the sensors data in Firebase
    const sensorsRef = ref(database, "sensors")

    // Set up real-time listener
    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setSensorData(data)
          setLastUpdate(new Date())
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      },
      (error) => {
        console.error("Firebase connection error:", error)
        setIsConnected(false)
      },
    )

    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, [])

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "No data"
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatLastUpdate = (date) => {
    if (!date) return "Never"
    return date.toLocaleTimeString()
  }

  const getSoilMoistureLevel = (moisture) => {
    // Assuming higher values mean drier soil (typical for resistive sensors)
    if (moisture > 800) return { level: "Dry", color: "text-red-500" }
    if (moisture > 600) return { level: "Low", color: "text-yellow-500" }
    if (moisture > 400) return { level: "Moderate", color: "text-blue-500" }
    return { level: "Wet", color: "text-green-500" }
  }

  const moistureInfo = getSoilMoistureLevel(sensorData.moisture)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <GiWateringCan className="text-blue-600" />
            Soil Moisture Data Dashboard
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
            <div className="text-gray-600">Last Update: {formatLastUpdate(lastUpdate)}</div>
          </div>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Temperature Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <WiThermometer className="text-4xl text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-700">Temperature</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{sensorData.temperature}°C</div>
            <div className="text-sm text-gray-500">
              {sensorData.temperature > 30 ? "Hot" : sensorData.temperature > 20 ? "Warm" : "Cool"}
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <WiHumidity className="text-4xl text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-700">Humidity</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{sensorData.humidity}%</div>
            <div className="text-sm text-gray-500">
              {sensorData.humidity > 70 ? "High" : sensorData.humidity > 40 ? "Normal" : "Low"}
            </div>
          </div>

          {/* Soil Moisture Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MdOutlineWaterDrop className="text-4xl text-green-500" />
                <h3 className="text-lg font-semibold text-gray-700">Soil Moisture</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{sensorData.moisture}</div>
            <div className={`text-sm font-medium ${moistureInfo.color}`}>{moistureInfo.level}</div>
          </div>

          {/* Rain Detection Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {sensorData.rain ? (
                  <WiRain className="text-4xl text-blue-600" />
                ) : (
                  <WiRaindrop className="text-4xl text-gray-400" />
                )}
                <h3 className="text-lg font-semibold text-gray-700">Rain Detection</h3>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${sensorData.rain ? "text-blue-600" : "text-gray-400"}`}>
              {sensorData.rain ? "DETECTED" : "NO RAIN"}
            </div>
            <div className="text-sm text-gray-500">{sensorData.rain ? "Rain is detected" : "No rain detected"}</div>
          </div>

          {/* Motor Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GiElectric className={`text-4xl ${sensorData.motor === "ON" ? "text-green-500" : "text-red-500"}`} />
                <h3 className="text-lg font-semibold text-gray-700">Motor Status</h3>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${sensorData.motor === "ON" ? "text-green-600" : "text-red-600"}`}>
              {sensorData.motor}
            </div>
            <div className={`text-sm font-medium ${sensorData.motor === "ON" ? "text-green-600" : "text-red-600"}`}>
              {sensorData.motor === "ON" ? "Irrigation active" : "Irrigation stopped"}
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isConnected ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">System Status</h3>
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${isConnected ? "text-green-600" : "text-red-600"}`}>
              {isConnected ? "ONLINE" : "OFFLINE"}
            </div>
            <div className="text-sm text-gray-500">Last sensor reading: {formatTimestamp(sensorData.timestamp)}</div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">System Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Environmental Conditions</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Temperature: {sensorData.temperature}°C</div>
                <div>Humidity: {sensorData.humidity}%</div>
                <div>Rain Status: {sensorData.rain ? "Detected" : "Not detected"}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Irrigation Status</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  Soil Moisture: {sensorData.moisture} ({moistureInfo.level})
                </div>
                <div>Motor: {sensorData.motor}</div>
                <div>System: {isConnected ? "Connected" : "Disconnected"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
