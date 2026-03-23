from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging
from .services.sync import sync_broker_trades

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def scheduled_sync_job():
    logger.info("Running background sync job for all brokers...")
    # In a real app, you would query Supabase for all active broker connections
    # and call sync_broker_trades() for each.
    # e.g.,
    # connections = supabase.table('broker_connections').select('*').execute()
    # for conn in connections.data:
    #     await sync_broker_trades(conn['user_id'], conn['broker_name'])
    pass

def start_scheduler():
    scheduler.add_job( scheduled_sync_job, 'interval', minutes=15)
    scheduler.start()
    logger.info("Background job scheduler started.")
