import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    console.log('🔍 Checking for pending translation jobs...')
    
    // Find all pending jobs with the translate-content task
    const pendingJobs = await payload.find({
      collection: 'payload-jobs',
      where: {
        and: [
          {
            taskSlug: {
              equals: 'translate-content'
            }
          },
          {
            completedAt: {
              exists: false
            }
          },
          {
            hasError: {
              not_equals: true
            }
          }
        ]
      }
    })

    if (pendingJobs.docs.length === 0) {
      console.log('✅ No pending translation jobs found')
      return NextResponse.json({ 
        success: true, 
        message: 'No pending translation jobs found',
        processed: 0
      })
    }

    console.log(`📋 Found ${pendingJobs.docs.length} pending translation job(s)`)
    
      const results = await payload.jobs.run({
      limit: 1 // Procesa de a un job a la vez
    })

    console.log(`🎯 Processed job(s)`)
    console.log('Results:', results)

    return NextResponse.json({
      success: true,
      message: `Successfully processed translation job(s)`,
      found: pendingJobs.docs.length,
      results: results
    })

  } catch (error) {
    console.error('❌ Error running translation jobs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return GET() // Allow both GET and POST
}