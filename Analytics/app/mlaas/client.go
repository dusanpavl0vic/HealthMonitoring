package mlaas

import (
	. "Analytics/app/models"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)
type MLaaSClient struct {
    baseURL    string
    httpClient *http.Client
}

func NewMLaaSClient(baseURL string) *MLaaSClient {
    return &MLaaSClient{
        baseURL: baseURL,
        httpClient: &http.Client{
            Timeout: 30 * time.Second,
        },
    }
}

func (c *MLaaSClient) PredictActivity(data AthletePredictRequest) (*MLaaSResponse, error) {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request: %v", err)
    }

    resp, err := c.httpClient.Post(
        c.baseURL+"/predict_activity",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        return nil, fmt.Errorf("HTTP request failed: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("MLaaS returned status: %d", resp.StatusCode)
    }

    var mlaasResp MLaaSResponse
    if err := json.NewDecoder(resp.Body).Decode(&mlaasResp); err != nil {
        return nil, fmt.Errorf("failed to decode response: %v", err)
    }

    if mlaasResp.Error != "" {
        return nil, fmt.Errorf("MLaaS error: %s", mlaasResp.Error)
    }

    return &mlaasResp, nil
}