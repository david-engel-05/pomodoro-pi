import { NextApiRequest, NextApiResponse } from 'next'
import * as si from 'systeminformation'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get current CPU load
    const cpuLoad = await si.currentLoad()
    
    // Get memory information
    const memory = await si.mem()
    
    // Try to get CPU temperature (may not be available on all systems)
    let temperature: number | undefined
    try {
      const temp = await si.cpuTemperature()
      temperature = temp.main || temp.cores?.[0] || undefined
    } catch (error) {
      // Temperature not available on this system
      temperature = undefined
    }

    const systemInfo = {
      cpu: {
        usage: cpuLoad.currentload || 0,
        temperature,
      },
      memory: {
        used: memory.used,
        total: memory.total,
        percentage: (memory.used / memory.total) * 100,
      },
      timestamp: Date.now(),
    }

    res.status(200).json(systemInfo)
  } catch (error) {
    console.error('Error getting system information:', error)
    res.status(500).json({ 
      error: 'Failed to get system information',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}