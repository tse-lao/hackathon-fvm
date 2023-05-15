export default function StravaActivity({ activity }) {
    // Convert distance from meters to kilometers with 2 decimal places
    const distanceInKm = (activity.distance / 1000).toFixed(2);

    // Convert moving time from seconds to minutes
    const movingTimeInMin = Math.round(activity.moving_time / 60);

    return (
        <div className="flex flex-col bg-gray-50 p-4 rounded-md mb-2 shadow-sm">
            <h2 className="text-lg font-semibold mb-1 text-indigo-600">{activity.name}</h2>
            <p className="text-gray-700">Type: {activity.type}</p>
            <p className="text-gray-700">Distance: {distanceInKm} km</p>
            <p className="text-gray-700">Moving Time: {movingTimeInMin} minutes</p>
            <p className="text-gray-700">Elevation Gain: {activity.total_elevation_gain} m</p>
        </div>
    );
}
