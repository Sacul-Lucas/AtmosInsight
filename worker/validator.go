package main

func (w WeatherMessage) IsValid() bool {
	return w.LocationID != "" &&
		w.Metrics.Temperature != 0 &&
		w.CollectedAt.IsZero() == false
}
