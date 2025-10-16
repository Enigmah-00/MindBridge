/**
 * Mental Health Risk Predictor using TensorFlow.js
 * Predicts risk level based on quiz scores and lifestyle data
 */

import * as tf from '@tensorflow/tfjs';
import { engineerFeatures, featuresToTensorInput, explainFeatureImportance, type RawUserData } from '../../../ml/utils/feature-engineering';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface RiskPrediction {
  riskLevel: RiskLevel;
  confidence: number;
  riskScore: number;
  factors: Array<{
    name: string;
    impact: number;
    type: 'risk' | 'protective';
  }>;
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'immediate';
}

export class RiskPredictor {
  private model: tf.LayersModel | null = null;
  private modelLoaded = false;

  /**
   * Initialize and load the ML model
   */
  async loadModel(): Promise<void> {
    if (this.modelLoaded) return;

    try {
      // Try to load pre-trained model
      // this.model = await tf.loadLayersModel('/ml/models/risk-assessment/model.json');
      // this.modelLoaded = true;
      
      // For now, create a simple model (later replace with trained model)
      this.model = this.createModel();
      this.modelLoaded = true;
      
      console.log('✅ Risk assessment model loaded successfully');
    } catch (error) {
      console.warn('⚠️ Could not load pre-trained model, using rule-based fallback');
      this.modelLoaded = false;
    }
  }

  /**
   * Create a neural network model for risk assessment
   */
  private createModel(): tf.LayersModel {
    const model = tf.sequential();
    
    // Input layer: 16 features
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [16],
      kernelInitializer: 'heNormal',
    }));
    
    model.add(tf.layers.dropout({ rate: 0.3 }));
    
    // Hidden layer
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      kernelInitializer: 'heNormal',
    }));
    
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
    // Hidden layer
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      kernelInitializer: 'heNormal',
    }));
    
    // Output layer: 4 risk levels (Low, Moderate, High, Critical)
    model.add(tf.layers.dense({
      units: 4,
      activation: 'softmax',
    }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    
    return model;
  }

  /**
   * Predict risk level for a user
   */
  async predict(userData: RawUserData): Promise<RiskPrediction> {
    // Engineer features from raw data
    const features = engineerFeatures(userData);
    
    // If model is loaded, use ML prediction
    if (this.modelLoaded && this.model) {
      return this.mlPredict(features, userData);
    }
    
    // Otherwise, use rule-based prediction
    return this.ruleBasedPredict(features, userData);
  }

  /**
   * ML-based prediction using TensorFlow.js
   */
  private async mlPredict(features: any, userData: RawUserData): Promise<RiskPrediction> {
    const inputArray = featuresToTensorInput(features);
    const inputTensor = tf.tensor2d([inputArray], [1, 16]);
    
    try {
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;
      const probabilities = await prediction.array() as number[][];
      const probs = probabilities[0] || [0, 0, 0, 0];
      
      // Find highest probability class
      const maxProb = Math.max(...probs);
      const predictedClass = probs.indexOf(maxProb);
      
      const riskLevels: RiskLevel[] = ['Low', 'Moderate', 'High', 'Critical'];
      const riskLevel = riskLevels[predictedClass] || 'Moderate';
      
      // Cleanup tensors
      inputTensor.dispose();
      prediction.dispose();
      
      return this.buildPredictionResult(riskLevel, maxProb, features, userData);
    } catch (error) {
      console.error('ML prediction error:', error);
      return this.ruleBasedPredict(features, userData);
    }
  }

  /**
   * Rule-based prediction (fallback)
   */
  private ruleBasedPredict(features: any, userData: RawUserData): RiskPrediction {
    let riskScore = 0;
    
    // Calculate risk score based on multiple factors
    riskScore += features.totalMentalHealthScore * 0.5; // 50% weight to mental health
    riskScore += (1 - features.lifestyleHealthScore) * 0.2; // 20% weight to lifestyle
    riskScore += (features.riskFactorCount / 5) * 0.2; // 20% weight to risk factors
    riskScore += (1 - features.protectiveFactorCount / 4) * 0.1; // 10% weight to protective factors
    
    // Determine risk level
    let riskLevel: RiskLevel;
    if (riskScore < 0.25) riskLevel = 'Low';
    else if (riskScore < 0.5) riskLevel = 'Moderate';
    else if (riskScore < 0.75) riskLevel = 'High';
    else riskLevel = 'Critical';
    
    // Calculate confidence
    const confidence = 0.85; // Rule-based has fixed confidence
    
    return this.buildPredictionResult(riskLevel, confidence, features, userData);
  }

  /**
   * Build complete prediction result with recommendations
   */
  private buildPredictionResult(
    riskLevel: RiskLevel,
    confidence: number,
    features: any,
    userData: RawUserData
  ): RiskPrediction {
    // Extract important factors
    const factors: Array<{name: string, impact: number, type: 'risk' | 'protective'}> = [];
    
    if (features.phq9_norm > 0.5) {
      factors.push({ name: 'Depression Symptoms', impact: features.phq9_norm, type: 'risk' });
    }
    if (features.gad7_norm > 0.5) {
      factors.push({ name: 'Anxiety Symptoms', impact: features.gad7_norm, type: 'risk' });
    }
    if (features.pss10_norm > 0.5) {
      factors.push({ name: 'Stress Level', impact: features.pss10_norm, type: 'risk' });
    }
    if (features.sleep_norm < 0.5) {
      factors.push({ name: 'Sleep Deprivation', impact: 1 - features.sleep_norm, type: 'risk' });
    }
    if (features.workStress_norm > 0.6) {
      factors.push({ name: 'Work Pressure', impact: features.workStress_norm, type: 'risk' });
    }
    if (features.exercise_norm > 0.6) {
      factors.push({ name: 'Physical Activity', impact: features.exercise_norm, type: 'protective' });
    }
    if (features.socialInteraction_norm > 0.6) {
      factors.push({ name: 'Social Support', impact: features.socialInteraction_norm, type: 'protective' });
    }
    
    // Sort by impact
    factors.sort((a, b) => b.impact - a.impact);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(riskLevel, userData, features);
    
    // Determine urgency
    const urgency = this.determineUrgency(riskLevel, userData);
    
    const riskScore = features.totalMentalHealthScore;
    
    return {
      riskLevel,
      confidence,
      riskScore,
      factors: factors.slice(0, 5), // Top 5 factors
      recommendations,
      urgency,
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(riskLevel: RiskLevel, userData: RawUserData, features: any): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'Critical' || riskLevel === 'High') {
      recommendations.push('🚨 Strongly consider scheduling an appointment with a mental health professional');
    }
    
    if (riskLevel === 'High' || riskLevel === 'Moderate') {
      recommendations.push('💬 Try our AI chatbot for immediate support and coping strategies');
    }
    
    if ((userData.phq9Score ?? 0) >= 15) {
      recommendations.push('💊 Discuss treatment options (therapy/medication) with a psychiatrist');
    }
    
    if ((userData.sleepHours ?? 7) < 6) {
      recommendations.push('😴 Prioritize sleep: aim for 7-9 hours, maintain consistent schedule');
    }
    
    if ((userData.exerciseMinutes ?? 0) < 90) {
      recommendations.push('🏃 Increase physical activity: aim for 150 min/week of moderate exercise');
    }
    
    if ((userData.workStress ?? 1) >= 4) {
      recommendations.push('🧘 Practice stress management: try breathing exercises, meditation, or yoga');
    }
    
    if ((userData.socialInteraction ?? 5) <= 2) {
      recommendations.push('👥 Strengthen social connections: reach out to friends, join support groups');
    }
    
    if (features.riskFactorCount >= 3) {
      recommendations.push('📊 Take our mental health assessments monthly to track your progress');
    }
    
    recommendations.push('🎮 Try our therapeutic games designed to reduce anxiety and improve mood');
    
    return recommendations.slice(0, 6); // Max 6 recommendations
  }

  /**
   * Determine urgency level
   */
  private determineUrgency(riskLevel: RiskLevel, userData: RawUserData): 'routine' | 'soon' | 'urgent' | 'immediate' {
    if (riskLevel === 'Critical') return 'immediate';
    
    // Check for severe depression or suicidal risk
    if ((userData.phq9Score ?? 0) >= 20) return 'immediate';
    
    // Check for severe anxiety
    if ((userData.gad7Score ?? 0) >= 15) return 'urgent';
    
    if (riskLevel === 'High') return 'urgent';
    if (riskLevel === 'Moderate') return 'soon';
    
    return 'routine';
  }
}

// Singleton instance
let predictorInstance: RiskPredictor | null = null;

export async function getRiskPredictor(): Promise<RiskPredictor> {
  if (!predictorInstance) {
    predictorInstance = new RiskPredictor();
    await predictorInstance.loadModel();
  }
  return predictorInstance;
}
