package main

func (w WeatherMessage) IsValid() bool {
	return w.LocationID != "" &&
		(w.Type == "observed" || w.Type == "forecast") &&
		!w.CollectedAt.IsZero()
}
